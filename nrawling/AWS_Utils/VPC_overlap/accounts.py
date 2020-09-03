# -*- coding: utf-8 -*-

"""Classes for AWS accounts."""

# import boto3
# from botocore.exceptions import ClientError


class OrgAccount:
    """Manage AWS Accounts from AWS Organizations."""

    def __init__(self, SESSION):
        """Create an OrgAccount object."""
        self.session = SESSION
        self.org = self.session.client('organizations')

    def get_accounts(self):
        """Get child accounts for current profile."""
        accounts = []
        response = self.org.list_accounts()
        for account in response['Accounts']:
            accounts = accounts + [{'AccountId': account['Id'], 'AccountName': account['Name']}]

        while not (response.get('NextToken',None) is None):
            response = self.org.list_accounts(NextToken=response['NextToken'])
            for account in response['Accounts']:
                accounts = accounts + [{'AccountId': account['Id'], 'AccountName': account['Name']}]

        return accounts
