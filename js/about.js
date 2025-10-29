function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// Find earliest and latest tweets
	let earliestTweet = tweet_array[0];
	let latestTweet = tweet_array[0];
	
	for (let tweet of tweet_array) {
		if (tweet.time < earliestTweet.time) {
			earliestTweet = tweet;
		}
		if (tweet.time > latestTweet.time) {
			latestTweet = tweet;
		}
	}
	
	// Format dates
	document.getElementById('firstDate').innerText = earliestTweet.time.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	
	document.getElementById('lastDate').innerText = latestTweet.time.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	
	// Count tweet categories
	let completedEvents = 0;
	let liveEvents = 0;
	let achievements = 0;
	let miscellaneous = 0;
	
	for (let tweet of tweet_array) {
		switch(tweet.source) {
			case 'completed_event':
				completedEvents++;
				break;
			case 'live_event':
				liveEvents++;
				break;
			case 'achievement':
				achievements++;
				break;
			case 'miscellaneous':
				miscellaneous++;
				break;
		}
	}
	
	// Calculate percentages
	let total = tweet_array.length;
	let completedEventsPct = (completedEvents / total * 100);
	let liveEventsPct = (liveEvents / total * 100);
	let achievementsPct = (achievements / total * 100);
	let miscellaneousPct = (miscellaneous / total * 100);
	
	// Update the DOM with counts
	let completedEventsSpans = document.getElementsByClassName('completedEvents');
	for (let span of completedEventsSpans) {
		span.innerText = completedEvents;
	}
	
	let liveEventsSpans = document.getElementsByClassName('liveEvents');
	for (let span of liveEventsSpans) {
		span.innerText = liveEvents;
	}
	
	let achievementsSpans = document.getElementsByClassName('achievements');
	for (let span of achievementsSpans) {
		span.innerText = achievements;
	}
	
	let miscellaneousSpans = document.getElementsByClassName('miscellaneous');
	for (let span of miscellaneousSpans) {
		span.innerText = miscellaneous;
	}
	
	// Update the DOM with percentages (formatted to 2 decimal places)
	let completedEventsPctSpans = document.getElementsByClassName('completedEventsPct');
	for (let span of completedEventsPctSpans) {
		span.innerText = math.format(completedEventsPct, {notation: 'fixed', precision: 2}) + '%';
	}
	
	let liveEventsPctSpans = document.getElementsByClassName('liveEventsPct');
	for (let span of liveEventsPctSpans) {
		span.innerText = math.format(liveEventsPct, {notation: 'fixed', precision: 2}) + '%';
	}
	
	let achievementsPctSpans = document.getElementsByClassName('achievementsPct');
	for (let span of achievementsPctSpans) {
		span.innerText = math.format(achievementsPct, {notation: 'fixed', precision: 2}) + '%';
	}
	
	let miscellaneousPctSpans = document.getElementsByClassName('miscellaneousPct');
	for (let span of miscellaneousPctSpans) {
		span.innerText = math.format(miscellaneousPct, {notation: 'fixed', precision: 2}) + '%';
	}
	
	// Count written tweets in completed events
	let writtenCompletedEvents = 0;
	for (let tweet of tweet_array) {
		if (tweet.source === 'completed_event' && tweet.written) {
			writtenCompletedEvents++;
		}
	}
	
	let writtenPct = (writtenCompletedEvents / completedEvents * 100);
	
	let writtenSpans = document.getElementsByClassName('written');
	for (let span of writtenSpans) {
		span.innerText = writtenCompletedEvents;
	}
	
	let writtenPctSpans = document.getElementsByClassName('writtenPct');
	for (let span of writtenPctSpans) {
		span.innerText = math.format(writtenPct, {notation: 'fixed', precision: 2}) + '%';
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});