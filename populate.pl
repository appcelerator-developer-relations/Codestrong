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
    $value =~ s/^\s*(.*?)\s*$/$1/;
    return $value;
}

my $sql = "";

# CREATE TABLES
$sql .= "CREATE TABLE user(uid INTEGER DEFAULT NULL, full_name VARCHAR DEFAULT NULL, name VARCHAR DEFAULT NULL, company VARCHAR DEFAULT NULL, picture VARCHAR, bio VARCHAR, data BLOB DEFAULT NULL);\n";
$sql .= "CREATE TABLE node(nid INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR DEFAULT NULL, instructors VARCHAR DEFAULT NULL, body VARCHAR DEFAULT NULL, room VARCHAR DEFAULT NULL, start_date VARCHAR DEFAULT NULL, end_date VARCHAR DEFAULT NULL, data BLOB DEFAULT NULL);\n\n";

# Process JSON for speakers
my $json = decode_json(getJsonFromUrl('http://codestrong.com/mobile/speakers'));
foreach my $entity (@{$json->{entities}}) {
	$sql .= "INSERT INTO user(uid, full_name, name, company, picture, bio, data) VALUES (";
	$sql .= $entity->{entity}->{uid} . ", ";
	$sql .= "'" . doEscape($entity->{entity}->{full_name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{company}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{picture}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{bio}) . "', ";
	$sql .= "'" . doEscape(encode_json($entity->{entity})) . "');\n";
}
$sql .= "\n";

# Process JSON for sessions
my $json = decode_json(getJsonFromUrl('http://codestrong.com/mobile/sessions'));
foreach my $entity (@{$json->{entities}}) {
	$sql .= "INSERT INTO node(nid, title, instructors, body, room, start_date, end_date, data) VALUES (";
	$sql .= "NULL, ";
	$sql .= "'" . doEscape($entity->{entity}->{title}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{instructors}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{body}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{room}) . "', ";
	
	my ($startDate, $endDate);
	if ($entity->{entity}->{time} =~ /^(\d+)\s+([^\s]+)\s+(\d\d\:\d\d)\s*\-\s*(\d\d\:\d\d)/) {
		my $day = $1;
		my $month = '09'; # $2, but its always September
		my $startTime = $3;
		my $endTime = $4;
		
		$startDate = "2011-$month-$day $startTime:00.000";
		$endDate   = "2011-$month-$day $endTime:00.000";
		$sql .= "'" . $startDate . "', ";
		$sql .= "'" . $endDate . "', ";
	} else {
		$startDate = "";
		$endDate   = "";
		$sql .= "NULL, ";
		$sql .= "NULL, ";
	}
	
	$entity->{entity}->{start_date} = $startDate;
	$entity->{entity}->{end_date} = $endDate;
	
	$sql .= "'" . doEscape(encode_json($entity->{entity})) . "');\n";
}
$sql .= "\n";
 
$sql =~ s/[^[:print:]\r\n\t\s]+//g;
 
open SQL, "> main.sql.script"; 
print SQL $sql;
close SQL;