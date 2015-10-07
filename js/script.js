var locations = {};

//from W3Schools
//same as trim(), which doesn't seem to be working in this context
function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

//calls myTrim() on each of the place values for a given entry, since extra white spaces were altering search results
function trimPlaceValues(studentEntry) {
	for (var placeIndex = studentEntry["loc"].length; placeIndex > 0; placeIndex--) {
		studentEntry["loc"][placeIndex-1] = myTrim(studentEntry["loc"][placeIndex-1]);
	}
}

/*
 * createStudentDataStructures
 * -----------------------------
 * Saves each row from the selected csv file representing a single student's data as a JS object
 * containing firstName, lastName, and loc fields (the last of which is an array of each location
 * specified).
 */
function createStudentDataStructures(data) {
	for (var i = 0; i < data.length; i++) {
		// create studentEntry object
		var studentEntry = {firstName: data[i][0], lastName: data[i][1]};
		studentEntry["loc"] = data[i][(data[i].length-1)].split(",");
		trimPlaceValues(studentEntry);
		
		//index studentEntry based on each loc value
		for (var j = studentEntry["loc"].length; j > 0; j--) { // in reverse order
			if (studentEntry["loc"][j-1] in locations) {
				locations[studentEntry["loc"][j-1]][locations[studentEntry["loc"][j-1]].length] = studentEntry; // append not a function?
			} else {
				locations[studentEntry["loc"][j-1]] = [studentEntry];
			}
		}
	}
}

function displayResult(entry) {
	var list = document.getElementById("text-display");
	var listItem = document.createElement('li');
	if (entry) {
	    listItem.appendChild(document.createTextNode(entry));
	} else {
		listItem.appendChild(document.createTextNode("No entries found."));
	}
	list.appendChild(listItem);
}

function clearOldResults() {
	var list = document.getElementById("text-display");
	while (list.firstChild) {
    	list.removeChild(list.firstChild);
	}
}

function displayResults(arr) {
	clearOldResults();
	if (arr.length == 0) displayResult("No results found.")
	for (var i = 0; i < arr.length; i++) {
		displayResult(arr[i]);
	}
}

// In development, not working presently
function removeDups(arr) {
	var newArr = [];
	//arr.sort();
	for (var i = 0; i < arr.length; i++) {
		if (!(arr[i] in newArr)) {
			newArr.push(arr[i]);
		}
	}
	return newArr;
}

/* searchForOtherUsers
 * --------------------
 * Given a location of any granularity, return other students' entries. At the top should be matches to the 
 * finest level (i.e. for a search of "Palo Alto, California", display "Palo Alto, California" before 
 * "San Francisco, California").
 */
function searchForOtherUsers(text) {
	var search = text.split(",");
	var results = [];
	for (var i = search.length; i > 0; i--) {
		search[i-1] = myTrim(search[i-1]);
		if (search[i-1] in locations) { // Most-general search
			results = locations[search[i-1]].concat(results); // Pre-pend most specific location results
		} else {
			break;
		}
	}
	var strArr = [];
	for (var j = 0; j < results.length; j++) {
		var entry = results[j].firstName + " " + results[j].lastName + ", ";
		for (var k = 0; k < results[j].loc.length - 1; k++) {
			entry += results[j].loc[k] + ", ";
		}
		entry += results[j].loc[results[j].loc.length - 1];
		strArr[strArr.length] = entry;
	}
	displayResults(strArr);
}
