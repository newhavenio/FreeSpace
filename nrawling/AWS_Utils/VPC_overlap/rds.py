# -*- coding: utf-8 -*-

"""Classes for AWS RDS resources."""

import boto3
# from botocore.exceptions import ClientError


class RelationalDatabaseService:
    """Retrieve information from AWS RDS."""

    def __init__(self, sessionParameter, region='us-east-1'):
        """Create a RelationalDatabaseService object."""
        self.session = sessionParameter
        self.rds = self.session.client('rds', region)

    def get_regions(self):
        """Get available regions for current profile. Recommend EC2 regions instead."""
        return [{'RegionName': region}
                for region in self.session.get_available_regions('rds')]

    def get_rds(self):
        """Get information on RDS instances in a single region."""
        return [{
                 'DBClusterIdentifier': rds.get('DBClusterIdentifier',''),
                 'DBInstanceIdentifier': rds['DBInstanceIdentifier'],
                 'DBInstanceClass': rds['DBInstanceClass'],
                 'AvailabilityZone': rds['AvailabilityZone'],
                 'MultiAZ': rds['MultiAZ'],
                 'Engine': rds['Engine'],
                 'EngineVersion': rds['EngineVersion'],
                 'AllocatedStorage': rds['AllocatedStorage'],
                 'StorageType': rds['StorageType'],
                 'StorageEncrypted': rds['StorageEncrypted'],
                 'KmsKeyId': rds.get('KmsKeyId',''), }
                for rds in self.rds.describe_db_instances()['DBInstances']]

    def get_all_rds(self,accounts,regions):
        """Get all RDS instances."""
        rds_list = []

        # Fetch regions once
        # https://github.com/boto/boto3/issues/2022
        # Use the EC2 describe to check opt-in status for new regions
        # regions = self.get_regions()

        # For each account, check for RDS instances in each region
        for account in accounts:
            # Should add a TRY block here
            # this assumes that the [default] profile has access to assume roles
            # NEED TO FIX
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
#                print("Processing account: " + account['AccountId'] + ", region: " +
#                        region['RegionName'] + "...")
                loop_rds = RelationalDatabaseService(
                    account_session,
                    region['RegionName'])
                for rds in loop_rds.get_rds():
                    rds['AccountId']= account['AccountId']
                    rds['AccountName'] = account['AccountName']
                    rds['Region'] = region['RegionName']
                    rds_list.append(rds)

        return rds_list
