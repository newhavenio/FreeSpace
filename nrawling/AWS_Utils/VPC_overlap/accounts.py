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
        return [{'AccountId': account['Id'], 'AccountName': account['Name']}
                for account in self.org.list_accounts()['Accounts']]
