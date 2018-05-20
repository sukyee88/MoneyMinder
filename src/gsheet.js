const {google} = require('googleapis');
const express = require('express');
const opn = require('opn');
const path = require('path');
const fs = require('fs');



function listMajors (auth) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1HtX2Fs3LYAUVCkY6hEKGXlwwqDA55KfHVm0xuoiu7zQ',
    range: 'Raw!A:D'
  }, (err, res) => {
    if (err) {
      console.error('The API returned an error.');
      throw err;
    }
    const rows = res.data.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      console.log('Name, Major:');
      for (const row of rows) {
        // Print columns A and E, which correspond to indices 0 and 4.
        console.log(`${row[0]}, ${row[3]}`);
      }
    }
  });
}

function addrow(data){

	const sheets = google.sheets({
		version: 'v4',
		auth: 'GOOGLE_TOKEN'
	});

	var values = [
		[
		    // Cell values
		    chatID: data.chatID,
		    amount: data.amount,
		    category: data.category
	  	]];
		var body = {
		  values: values
		};

	sheets.spreadsheets.values.append({
    spreadsheetId: '1HtX2Fs3LYAUVCkY6hEKGXlwwqDA55KfHVm0xuoiu7zQ',
    range: 'Raw!A:D'
    valueInputOption: valueInputOption,
	resource: body
	},function(err, result) {
	  if(err) {
	    // Handle error.
	    console.log(err);
	  } else {
	    console.log('%d cells appended.', result.updates.updatedCells);
	  }
	});
}

