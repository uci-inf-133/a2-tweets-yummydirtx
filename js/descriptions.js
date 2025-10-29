// Store the written tweets globally so we can search them
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	let tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// Filter to only tweets with written text
	writtenTweets = tweet_array.filter(tweet => tweet.written);
	
	// Initialize the display with empty search
	updateSearchResults('');
}

function updateSearchResults(searchText) {
	// Filter tweets based on search text (case-insensitive)
	let filteredTweets = writtenTweets;
	
	if (searchText && searchText.trim() !== '') {
		let lowerSearchText = searchText.toLowerCase();
		filteredTweets = writtenTweets.filter(tweet => 
			tweet.writtenText.toLowerCase().includes(lowerSearchText)
		);
	}
	
	// Update the search count and text displays
	document.getElementById('searchCount').innerText = filteredTweets.length;
	document.getElementById('searchText').innerText = searchText;
	
	// Get the table body
	let tableBody = document.getElementById('tweetTable');
	
	// Clear the table
	tableBody.innerHTML = '';
	
	// Populate the table with filtered results
	if (searchText && searchText.trim() !== '') {
		filteredTweets.forEach((tweet, index) => {
			tableBody.innerHTML += tweet.getHTMLTableRow(index + 1);
		});
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let searchBox = document.getElementById('textFilter');
	
	// Add event listener for input events (fires on every keystroke)
	searchBox.addEventListener('input', function(event) {
		let searchText = event.target.value;
		updateSearchResults(searchText);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});