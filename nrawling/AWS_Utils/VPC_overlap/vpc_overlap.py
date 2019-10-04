#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""vpc_overlap: check an AWS Organization VPCs for address overlaps.

vpc_overlap makes it easier to check for network overlaps across accounts.
- Fetch AWS Account list from AWS Organizations
- Fetch VPCs for each account, for each region
- Check and report network overlaps
"""

import csv
import ipaddress
import sys

import boto3
import click

from accounts import OrgAccount
from ec2 import ElasticComputeCloud

SESSION = None
ORGACCOUNT = None


def deliver_output(data):
    """Use to process data output, currently CSV only."""
    writer = csv.DictWriter(sys.stdout, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)


@click.group()
@click.option('--profile', default=None, help="Use a given AWS profile.")
def cli(profile):
    """vpc_overlap checks an AWS Organization VPCs for address overlaps."""
    global SESSION, ORGACCOUNT

    session_cfg = {}
    if profile:
        session_cfg['profile_name'] = profile

    SESSION = boto3.Session(**session_cfg)
    ORGACCOUNT = OrgAccount(SESSION)


@cli.command('fetch-accounts')
def fetch_accounts():
    """Retrieve list of accounts in AWS Organizations."""
    global ORGACCOUNT

    deliver_output(ORGACCOUNT.get_accounts())


@cli.command('fetch-regions')
def fetch_regions():
    """Retrieve list of regions from EC2 service."""
    ecc = ElasticComputeCloud(SESSION)

    deliver_output(ecc.get_regions())


@cli.command('fetch-vpcs')
def fetch_vpcs():
    """Retrieve VPCs for accounts."""
    global SESSION, ORGACCOUNT

    accounts = ORGACCOUNT.get_accounts()
    ecc = ElasticComputeCloud(SESSION)

    deliver_output(ecc.get_all_vpcs(accounts))


@cli.command('compute-overlaps')
def compute_overlaps():
    """Compute and display VPC network overlaps."""
    global SESSION, ORGACCOUNT

    accounts = ORGACCOUNT.get_accounts()
    ecc = ElasticComputeCloud(SESSION)
    vpcs = ecc.get_all_vpcs(accounts)

    overlaps = []

    # walk dict of vpcs looking for conflicts
    # for vpc in vpcs:
    for i, vpc in enumerate(vpcs):
        net = ipaddress.IPv4Network(vpc['CidrBlock'])
        # for vpc2 in vpcs:
        for i2 in range(i + 1, len(vpcs)):
            vpc2 = vpcs[i2]
            if (vpc['VpcId'] != vpc2['VpcId']) and (
                    net.overlaps(ipaddress.IPv4Network(vpc2['CidrBlock']))):
                overlaps = overlaps + [{
                    'FirstVpcAccountId': vpc['AccountId'],
                    'FirstVpcAccountName': vpc['AccountName'],
                    'FirstVpcRegion': vpc['Region'],
                    'FirstVpcId': vpc['VpcId'],
                    'FirstVpcCidr': vpc['CidrBlock'],
                    'SecondVpcAccountId': vpc2['AccountId'],
                    'SecondVpcAccountName': vpc2['AccountName'],
                    'SecondVpcRegion': vpc2['Region'],
                    'SecondVpcId': vpc2['VpcId'],
                    'SecondVpcCidr': vpc2['CidrBlock']}]

    deliver_output(overlaps)


if __name__ == '__main__':
    cli()
