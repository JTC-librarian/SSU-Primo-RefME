////***This version was created on 21/11/16.***////
////**It uses the JQUERY.PRIMO to get all the bib data**/////
/// Variables for the button in the Send to list
var tabClickedType ;
var tabClickedNumber ;
var actionsMenuClickedNumber ;
var actionsMenuClickedId ;
var actionsAlertCreated ;

/// Variables for the button on the tab bar
var index;
var recordCount;

/// Variables for use throughout
var checkIfDetailedPage;
var globalBasicType;

/// Use this section to declare variables that make up the citation ///

var AUTHOR_ARRAY = [];
var TYPE = "";
var TITLE = "";
var EDITION = "";
var YEAR = "";
var MONTH = "";
var DAY = "";
var PUBLISHER = "";
var PLACE = "";
var RECORDID = "";
var VOLUME = "";
var ISSUE = "";
var CONTAINER = "";
var PAGES = "";

///START
//Are we on the brief or detailed page? - to be used throughout//
checkIfDetailedPage = $('h1.EXLResultTitle').text();
//Add types of buttons depending on preference
addTopLevelButton();
addActionsMenuButton();
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Function to put the button on the front bar //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function addTopLevelButton() {
	recordCount = jQuery.PRIMO.records.length;
	for (index=0; index<recordCount; index++){
		actionsMenuClickedNumber = index.toString();
		if (checkIfDetailedPage) {
			var place = $('.EXLSummary .EXLSummaryContainer .EXLSummaryFields');
			var frbrRecord = $('.EXLSummary .EXLSummaryContainer .EXLSummaryFields .EXLResultSeeFrbrLink');
		}
		else {
			var place = $('#exlidResult' + actionsMenuClickedNumber + ' .EXLSummary .EXLSummaryContainer .EXLSummaryFields');
			var frbrRecord = $('#exlidResult' + actionsMenuClickedNumber + ' .EXLSummary .EXLSummaryContainer .EXLSummaryFields .EXLResultSeeFrbrLink');
		}
		if (frbrRecord.length === 0) {
			getBibData();
			if (globalBasicType === "book" || globalBasicType === "article") {
				place.append('<div class="refme-auto-cite-top" id="refme-auto-cite-top' + actionsMenuClickedNumber + '"></div>');
				var citationObject = {
					element:"#refme-auto-cite-top" + actionsMenuClickedNumber,
					config:{style:"harvard-southampton-solent"},
					data:[{
						id:RECORDID,
						title:TITLE,
						edition:EDITION,
						type:TYPE,
						author:AUTHOR_ARRAY,
						issued:{year:YEAR, month:MONTH, day:DAY},
						publisher:PUBLISHER,
						'publisher-place':PLACE,
						volume:VOLUME,
						issue:ISSUE,
						page:PAGES,
						'container-title':CONTAINER
					}]
				}
				RefME.createButton(citationObject);
				$('#refme-auto-cite-top' + actionsMenuClickedNumber).css({'position':'relative','left':'500px','height':'0px'});
				/// Send a Google analytics click event ///
				$('#refme-auto-cite-top' + actionsMenuClickedNumber + ' div a img').click(function(){
					var thisRecordNumber = $(this).parent().parent().parent().attr('id');
					thisRecordNumber = thisRecordNumber.replace("refme-auto-cite-top", "");
					var thisRecordId = $('#exlidResult' + thisRecordNumber + ' .EXLThumbnail a').attr('name');
					ga('send', 'event', 'RefME - top level', 'click', thisRecordId);
				});
				//  Make blank the global variables for the next reference ///
			}
			blankCitationVariables();
		}
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Functions to put button on the Actions Menu /////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function addActionsMenuButton() {
	if (checkIfDetailedPage) { detailedFirstAlert();}
	else { briefWaitClickTabs();}
}

function detailedFirstAlert() {
	var openActionsMenu = $('.EXLTabHeaderButtonSendTo');
	openActionsMenu.click(briefDoActionsAlert);
	briefWaitClickTabs();
}

function briefWaitClickTabs() {
	$('.EXLResultTab').click(function(){
		tabClicked = $(this).attr('id');
		tabClicked = tabClicked.replace("exlidResult", "");
		tabClicked = tabClicked.match(/^(.*?)-(.*)/);
		tabClickedNumber = tabClicked[1];
		tabClickedType = tabClicked[2];
		actionsAlertCreated = false;
		window.setInterval(briefSetActionsAlert, 200);
	});
}

function briefSetActionsAlert(){
	if (actionsAlertCreated === false) {
		tabClickedType = tabClickedType.toLowerCase();
		tabClickedType = tabClickedType.replace("tab", "Tab");
		tabClickedType = tabClickedType.replace("onlineTab", "OnlineTab");
		tabClickedType = tabClickedType.replace("reviewsTab", "tagreviewsTab");
		tabClickedType = tabClickedType.replace("tagtagreviewsTab", "tagreviewsTab");
		window["localButton" + tabClickedNumber] = $('#exlidResult' + tabClickedNumber + '-TabContainer-' + tabClickedType + ' .EXLTabHeaderButtonSendTo'); // Dynamic variable!
		if (window["localButton" + tabClickedNumber].length > 0) {
			window["localButton" + tabClickedNumber].click(briefDoActionsAlert);
			actionsAlertCreated = true;
			window["localButton" + tabClickedNumber].length = 0;
		}
	}
}

function briefDoActionsAlert(){
	actionsMenuClickedId = $(this).parent().parent().parent().parent().attr('id'); // This gets most of them, but the locations tab is five levels up and leaves this undefined.
	if (typeof actionsMenuClickedId == "undefined") {actionsMenuClickedId = $(this).parent().parent().parent().parent().parent().attr('id');}
	if (actionsMenuClickedId.substr(0,4) === "tags") {actionsMenuClickedId = $(this).parent().parent().parent().parent().parent().attr('id');}
	actionsMenuClickedNumber = actionsMenuClickedId.match(/exlidResult(.*?)-/)[1]; // getting the value from an implicit array
	var sendToList = $('#' + actionsMenuClickedId + ' .EXLTabHeaderButtonSendTo .EXLTabHeaderButtonSendToList');
	var refMeButton = $('#' + actionsMenuClickedId + ' .EXLTabHeaderButtonSendTo .EXLTabHeaderButtonSendToList .RefMeButton');
	if (refMeButton.length === 0) {
		sendToList.append('<li class="RefMeButton"><span class="RefMeButtonLabel">RefMe</span><span class="RefMeButtonImage"><div class="refme-auto-cite" id="refme-auto-cite' + actionsMenuClickedId + '"></div></span></li>');
		getBibData();
		var citationObject = {
			element:"#refme-auto-cite" + actionsMenuClickedId,
			config:{style:"harvard-southampton-solent"},
			data:[{
				id:RECORDID,
				title:TITLE,
				edition:EDITION,
				type:TYPE,
				author:AUTHOR_ARRAY,
				issued:{year:YEAR, month:MONTH, day:DAY},
				publisher:PUBLISHER,
				'publisher-place':PLACE,
				volume:VOLUME,
				issue:ISSUE,
				page:PAGES,
				'container-title':CONTAINER
			}]
		}
		RefME.createButton(citationObject);
		if (checkIfDetailedPage) { // Different position needed for brief/detailed views
			$('#refme-auto-cite' + actionsMenuClickedId).css({'position':'relative','left':'64px','top':'-2px'});
		}
		else {
			$('#refme-auto-cite' + actionsMenuClickedId).css({'position':'relative','left':'69px','top':'-2px'});
		}
		$('#refme-auto-cite' + actionsMenuClickedId + ' div a img').css('height','18px');
		$('#refme-auto-cite' + actionsMenuClickedId + ' div a img').click(function(){
			window["buttonAlertHandle" + actionsMenuClickedId] = window.setInterval(setButtonAlert, 100); //Dynamic variable again
			var thisRecordNumber = $(this).parent().parent().parent().attr('id');
			thisRecordNumber = thisRecordNumber.replace(/-Tab.*/, "");
			thisRecordNumber = thisRecordNumber.replace("refme-auto-citeexlidResult", "");
			var thisRecordId = $('#exlidResult' + thisRecordNumber + ' .EXLThumbnail a').attr('name');
			ga('send', 'event', 'RefME - actions menu', 'click', thisRecordId);
		});
	/// Make blank the global variables for the next reference ///
		blankCitationVariables();
	}
}

function setButtonAlert(){
	$('div.refme-auto-cite iframe').css({'left':'-320px','top':'-180px'});
	clearInterval(window["buttonAlertHandle" + actionsMenuClickedNumber]);
	window["buttonAlertHandle" + actionsMenuClickedNumber] = 0;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Functions to get bib data //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function getBibData() {
	blankCitationVariables();
	getBibDataFromPnx();
}

function getBibDataFromPnx() {
try {
	var samplePnx = jQuery.PRIMO.records[actionsMenuClickedNumber].getPNX();
	samplePnx = removeUnwantedCharacters(samplePnx);
//Get the adddata section and parse
	var addData = samplePnx.match(/<addata>.*?<\/addata>/);
	addData = addData[0];
	var xmlDoc = $.parseXML(addData);
	var adddata_xml = $(xmlDoc);
//get the control section and parse
	var controlData = samplePnx.match(/<control>.*?<\/control>/);
	controlData = controlData[0];
	var xmlDoc = $.parseXML(controlData);
	var control_xml = $(xmlDoc);
//get the display section and parse
	var displayData = samplePnx.match(/<display>.*?<\/display>/);
	displayData = displayData[0]
	var xmlDoc = $.parseXML(displayData);
	var display_xml = $(xmlDoc);
//get the sort section and parse
	var sortData = samplePnx.match(/<sort>.*?<\/sort>/);
	sortData = sortData[0]
	var xmlDoc = $.parseXML(sortData);
	var sort_xml = $(xmlDoc);
/// Now we have the xml parsed and ready to access in an easy way ///
/// Look first for all the authors ///
	var $au = adddata_xml.find("au");
	var $addau = adddata_xml.find("addau");
	var allAuthors = [];
	for (i=0; i<$au.length; i++) {
		allAuthors.push($au[i]);
	}
	for (i=0; i<$addau.length; i++) {
		allAuthors.push($addau[i]);
	}
	for (i=0; i<allAuthors.length; i++) {
		window["authorText" + i] = allAuthors[i].textContent; // This is how you create dynamic variables in js. They are global.
		window["Author" + i] = new Author("", ""); // And again.
		getAuthor(window["authorText" + i], window["Author" + i]);
	}
/// Look now for the title ///
	var $title = adddata_xml.find("atitle");
	if ($title.length===0) {
		$title = adddata_xml.find("btitle");
	}
	if ($title.length===0) {
		$title = adddata_xml.find("jtitle");
	}
	if ($title.length===0) {
		$title = sort_xml.find("title"); // Some don't have a title in adddata! = sort is better as does not have <span> in it.
	}
	TITLE = $title[0].textContent;
	TITLE = TITLE.replace(/ $/, "");
	TITLE = TITLE.replace(/\.$/, "");
/// Look now for the container ///
	var $checkContainer = adddata_xml.find("atitle");
	if ($checkContainer.length>0) {
		var $container = adddata_xml.find("jtitle");
		if ($container.length===0) {
			CONTAINER = "";
		}
		else {
			CONTAINER = $container[0].textContent;
		}
	}
/// Look now for the date ///
	var $date = adddata_xml.find("risdate");
	if ($date.length===0) {
		$date = adddata_xml.find("date");
		if ($date.length===0) {
			DATE = "";
		}
		else {
			DATE = $date[0].textContent;
		}
	}
	else {
		DATE = $date[0].textContent;
	}
	DATE = DATE.replace(".", "");
	DATE = DATE.replace("c", "");
	DATE = DATE.replace("©", "");
	DATE = DATE.replace("[", "");
	DATE = DATE.replace("]", "");
	YEAR = DATE.slice(0,4);
	MONTH = DATE.slice(0,6);
	DAY = DATE.slice(6,8);
/// look now for publisher ///
	var $pub = adddata_xml.find("pub");
	if ($pub.length===0) {
		PUBLISHER = "";
	}
	else {
		PUBLISHER = $pub[0].textContent;
	}
/// look now for the place ///
	var $place = adddata_xml.find("cop");
	if ($place.length===0) {
		PLACE = "";
	}
	else {
		PLACE = $place[0].textContent;
	}
/// Look now for the volume ///
	var $volume = adddata_xml.find("volume");
	if ($volume.length===0) {
		VOLUME = "";
	}
	else {
		VOLUME = $volume[0].textContent;
	}
/// Look now for the issue ///
	var $issue = adddata_xml.find("issue");
	if ($issue.length===0) {
		ISSUE = "";
	}
	else {
		ISSUE = $issue[0].textContent;
	}
/// Look now for the page numbers ///
// Get start page
	var SPAGE;
	var $spage = adddata_xml.find("spage");
	if ($spage.length===0) {
		SPAGE = ""
	}
	else {
		SPAGE = $spage[0].textContent;
	}
// Get end page
	var EPAGE;
	var $epage = adddata_xml.find("epage");
	if ($epage.length===0) {
		EPAGE = ""
	}
	else {
		EPAGE = $epage[0].textContent;
	}
// Put together
	if (SPAGE==="") {
		PAGES = "";
	}
	else if (EPAGE==="") {
		PAGES = SPAGE;
	}
	else {
		PAGES = SPAGE + "-" + EPAGE;
	}
/// Look now for the ID (Bib number) ///
	var $recordid = control_xml.find("recordid");
	RECORDID = $recordid[0].textContent;
/// Look now for the edition ///
// At Solent the edition is in the display/lds05 field
	var $edition = display_xml.find("lds05");
	if ($edition[0] != null) {EDITION = $edition[0].textContent;}
/// Look now for the type ///
// Remote record adddata/ristype is unrelaible, take from display instead
	var $type = display_xml.find("type");
	if ($type.length===0) {
		$type = "";
	}
	else {
		$type = $type[0].textContent;
	}
	$type = $type.toLowerCase();
	globalBasicType = $type;
	TYPE = assignType($type);
}
catch(err) {console.log("Error in function getBibDataFromPnx: " + err.message);}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Functions to normalize bib data //////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Author(given, family) {
	this.given = given;
	this.family = family;
}

function getAuthor(authorText, authorVariable){
	authorText = authorText.replace(/\(.*?\)/, "");
	authorText = authorText.replace(/\[.*?\]/, "");
	authorText = removeUnwantedCharacters(authorText);
	authorText = authorText.replace(/,$/, "");
	if (authorText.length > 50) { // Assume is a corporate name
		authorVariable.family = authorText;
		authorVariable.given = "";
	}
	else {
		if (jQuery.PRIMO.records[actionsMenuClickedNumber].isRemoteRecord()) { //Treat differently if remote
			if (authorText.indexOf(",") !== -1) {// remote but with comma - personal
				authorText = authorText.match(/(.*?),(.*)/);
				authorVariable.family = authorText[1];
				authorVariable.given = authorText[2];
			}
			else { // remote with no comma - but short so probably still personal
				var i = authorText.lastIndexOf(" ");
				if (i !== -1) { // if space - personal
					authorVariable.family = authorText.substring(i,authorText.length);
					authorVariable.given = authorText.substring(0,i);
				}
				else { // if no space - corporate
					authorVariable.family = authorText;
					authorVariable.given = "";
				}
			}
		}
		else {
			if (authorText.indexOf(",") !== -1) { // local and with comma - personal
				authorText = authorText.match(/(.*?),(.*)/);
				authorVariable.family = authorText[1];
				authorVariable.given = authorText[2];
			}
			else { // local but with no comma - corporate
				authorVariable.family = authorText;
				authorVariable.given = "";
			}
		}
	}
/// Include cludge to send just the initials to RefME ///
	authorVariable.given = authorVariable.given.replace(".", ". ");
	while (authorVariable.given.indexOf("  ") > 0) {
		authorVariable.given = authorVariable.given.replace("  ", " ");
	}
	authorVariable.given = authorVariable.given.replace(/^ /, "");
	authorVariable.given = authorVariable.given.replace(/ $/, "");
	if (authorVariable.given.length > 0) {
		authorVariable.given_array = authorVariable.given.split(" ");
		authorVariable.given = "";
		for (i=0; i<authorVariable.given_array.length; i++) {
			authorVariable.given = authorVariable.given + authorVariable.given_array[i].substring(0,1) + ". ";
		}
	}
/// End of this section
	authorVariable.formatted = {given:authorVariable.given, family:authorVariable.family};
/// Cludge to add "Anon" when no author supplied
	if (authorVariable.given === "" && authorVariable.family === "") { authorVariable.formatted = {given: "", family: "Anon."}; }
/// End of this section.
	AUTHOR_ARRAY.push(authorVariable.formatted);
}

function assignType(startType) {
	var endType = "book"; // set the default!
	//Now change for records
	if (startType === "article") { endType = "article-journal"; }
	else if (startType === "newspaper_article") {endType = "article-newspaper"; }
	else if (startType === "review") {endType = "article-journal"; } //'review-book' doesn't seem right -- check with Kathryn & Hannah
	else if (startType === "conference_proceeding") {endType = "paper-conference"; } //it seems most stuff identified as "conference proceeding" in Primo is actually an article
	else if (startType === "dissertation") {endType = "book"; } // I tried 'thesis' but it didn't include the year! -- check with Kathryn & Hannah
	else if (startType === "reference_entry") {endType = "entry-encyclopedia"; }
	else if (startType === "web_site") {endType = "webpage"; }
	else if (startType === "patent") {endType = "patent"; }
	else if (startType === "map") {endType = "map"; }
	else if (startType === "legal_document") {endType = "legal_case"; }
	else if (startType === "score") {endType = "musical_score"; }
	else if (startType === "image") {endType = "graphic"; }
	else if (startType === "research_dataset") {endType = "dataset"; }
	else if (startType === "statistical_data_set") {endType = "dataset"; }
	else if (startType === "journal") {endType = "periodical"; }
	else if (startType === "text_resource") {endType = "article-journal"; }
	return endType;
}

function removeUnwantedCharacters(startText) {
	endText = startText.replace(/\n/g, "");
	endText = endText.replace(/\r/g, "");
	endText = endText.replace(/\t/g, "");
	while (endText.indexOf("  ") !== -1) {
		endText = endText.replace("  ", " ");
	}
	endText = endText.replace(/^ /g, "");
	endText = endText.replace(/ $/g, "");
	return endText;
}

function normalizeEditionStatement(startText) {
	var regex = new RegExp(' edition', 'gi');
	endText = startText.replace(regex, "");
	regex = new RegExp(' ed', 'gi');
	endText = endText.replace(regex, "");
	regex = new RegExp('edn', 'gi');
	endText = endText.replace(regex, "");
	regex = new RegExp('first', 'gi');
	endText = endText.replace(regex, "1st");
	regex = new RegExp('second', 'gi');
	endText = endText.replace(regex, "2nd");
	regex = new RegExp('third', 'gi');
	endText = endText.replace(regex, "3rd");
	regex = new RegExp('fourth', 'gi');
	endText = endText.replace(regex, "4th");
	regex = new RegExp('fifth', 'gi');
	endText = endText.replace(regex, "5th");
	regex = new RegExp('sixth', 'gi');
	endText = endText.replace(regex, "6th");
	regex = new RegExp('seventh', 'gi');
	endText = endText.replace(regex, "7th");
	regex = new RegExp('eighth', 'gi');
	endText = endText.replace(regex, "8th");
	regex = new RegExp('ninth', 'gi');
	endText = endText.replace(regex, "9th");
	regex = new RegExp('tenth', 'gi');
	endText = endText.replace(regex, "10th");
	regex = new RegExp('eleventh', 'gi');
	endText = endText.replace(regex, "11th");
	regex = new RegExp('twelth', 'gi');
	endText = endText.replace(regex, "12th");
	endText = removeUnwantedCharacters(endText)
	endText = endText.replace(".", "");
	return endText;
}

/// Way to make sure variables are blanked
function blankCitationVariables() {
  AUTHOR_ARRAY = [];
  TYPE = "";
  TITLE = "";
  EDITION = "";
  YEAR = "";
  MONTH = "";
  DAY = "";
  PUBLISHER = "";
  PLACE = "";
  RECORDID = "";
  VOLUME = "";
  ISSUE = "";
  CONTAINER = "";
  PAGES = "";
}