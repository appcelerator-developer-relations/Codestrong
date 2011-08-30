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
$sql .= "CREATE TABLE node(nid INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR DEFAULT NULL, instructors VARCHAR DEFAULT NULL, teaser VARCHAR DEFAULT NULL, level VARCHAR DEFAULT NULL, topic VARCHAR DEFAULT NULL, room VARCHAR DEFAULT NULL, start_date VARCHAR DEFAULT NULL, end_date VARCHAR DEFAULT NULL);\n\n";

# Process JSON for speakers
my $json = decode_json(getJsonFromUrl('http://codestrong.com/mobile/speakers'));
foreach my $entity (@{$json->{entities}}) {
	$sql .= "INSERT INTO user(uid, name, full_name, username, picture, bio, data) VALUES (";
	$sql .= $entity->{entity}->{uid} . ", ";
	$sql .= "'" . doEscape($entity->{entity}->{name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{full_name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{Name}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{picture}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{bio}) . "', ";
	$sql .= "'" . doEscape(encode_json($entity->{entity})) . "');\n";
}
$sql .= "\n";

# Process JSON for sessions
my $json = decode_json(getJsonFromUrl('http://codestrong.com/mobile/sessions'));
foreach my $entity (@{$json->{entities}}) {
	$sql .= "INSERT INTO node(nid, title, instructors, teaser, level, topic, room, start_date, end_date) VALUES (";
	$sql .= "NULL, ";
	$sql .= "'" . doEscape($entity->{entity}->{Session}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{'Speaker(s)'}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{'teaser'}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{'Experience level'}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{'Topic'}) . "', ";
	$sql .= "'" . doEscape($entity->{entity}->{'Room'}) . "', ";
	
	if ($entity->{entity}->{'Time slot'} =~ /^(\d+)\s+([^\s]+)\s+(\d\d\:\d\d)\s*\-\s*(\d\d\:\d\d)/) {
		my $day = $1;
		my $month = '09'; # $2, but its always September
		my $startTime = $3;
		my $endTime = $4;
		my $startDate = "2011-$month-$day $startTime:00.000";
		my $endDate   = "2011-$month-$day $endTime:00.000";
		
		$sql .= "'" . $startDate . "', ";
		$sql .= "'" . $endDate . "');\n";
	} else {
		$sql .= "NULL, ";
		$sql .= "NULL);\n";
	}
}
$sql .= "\n";
 
$sql =~ s/[^[:print:]\r\n\t\s]+//g;
 
open SQL, "> main.sql.script"; 
print SQL $sql;
close SQL;