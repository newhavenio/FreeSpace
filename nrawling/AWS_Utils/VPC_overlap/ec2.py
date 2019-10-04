# -*- coding: utf-8 -*-

"""Classes for AWS EC2 resources."""

import boto3
# from botocore.exceptions import ClientError


class ElasticComputeCloud:
    """Retrieve information from AWS EC2."""

    def __init__(self, sessionParameter, region='us-east-1'):
        """Create an ElasticComputeCloud object."""
        self.session = sessionParameter
        self.ecc = self.session.client('ec2', region)

    def get_regions(self):
        """Get available regions for current profile."""
        return [{'RegionName': region['RegionName']}
                for region in self.ecc.describe_regions()['Regions']]

    def get_vpcs(self):
        """Get VPCs for current profile."""
        return [{'VpcId': vpc['VpcId'], 'CidrBlock': vpc['CidrBlock']}
                for vpc in self.ecc.describe_vpcs()['Vpcs']]

    def get_all_vpcs(self, accounts):
        """Get VPCs for all child accounts."""
        vpcs = []

        # Fetch regions once
        regions = self.get_regions()

        # For each account, check for VPCs in each region
        for account in accounts:
            # We will try to change the to Admin role of child accounts
            # Should add a TRY block here
            sts_client = boto3.client('sts')
            assumed_role_object = sts_client.assume_role(
                RoleArn="arn:aws:iam::"+account['AccountId']+":role/Admin",
                RoleSessionName="AssumeRoleSession1")
            credentials = assumed_role_object['Credentials']

            account_session = boto3.Session(
                aws_access_key_id=credentials['AccessKeyId'],
                aws_secret_access_key=credentials['SecretAccessKey'],
                aws_session_token=credentials['SessionToken'],
            )

            for region in regions:
                loop_ecc = ElasticComputeCloud(
                    account_session,
                    region['RegionName'])
                for vpc in loop_ecc.get_vpcs():
                    vpc['AccountId'] = account['AccountId']
                    vpc['AccountName'] = account['AccountName']
                    vpc['Region'] = region['RegionName']
                    vpcs.append(vpc)

        return vpcs
