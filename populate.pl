#!/usr/bin/perl

use strict 'vars';
use LWP::Simple;
use JSON;
use Data::Dumper;

sub getJsonFromUrl {
	my $url = shift;
	my $content = get $url;
	die "Couldn't get $url" unless defined $content;
	return $content;
}

sub doEscape {
    my $value = shift;
    $value =~ s/'/''/g;
    return $value;
}

my $sql = "";

# CREATE TABLES
$sql .= "CREATE TABLE user(uid INTEGER DEFAULT NULL,name VARCHAR DEFAULT NULL, full_name VARCHAR DEFAULT NULL, username VARCHAR DEFAULT NULL, picture VARCHAR, bio VARCHAR, data BLOB DEFAULT NULL);\n";
# $sql .= "CREATE TABLE node();\n\n";

# PROCESS JSON
my $json = decode_json(getJsonFromUrl('http://codestrong.com/mobile/speakers'));
foreach my $entity (@{$json->{entities}}) {
	$sql .= "INSERT INTO user(uid, name, full_name, username, picture, bio, data) VALUES (";
	$sql .= $entity->{entity}->{uid} . ", ";
	$sql .= "'" . doEscape($entity->{entity}->{name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{full_name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{Name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{picture}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{bio}) . "', ";
	$sql .= "NULL);\n";
}
 
$sql =~ s/[^[:print:]]+//g;
 
open SQL, "> main.sql"; 
print SQL $sql;
close SQL;