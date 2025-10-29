function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	// Filter to completed events only
	let completedTweets = tweet_array.filter(tweet => tweet.source === 'completed_event');
	
	// Count activities
	let activityCounts = {};
	completedTweets.forEach(tweet => {
		let activity = tweet.activityType;
		if (activity && activity !== "") {
			activityCounts[activity] = (activityCounts[activity] || 0) + 1;
		}
	});
	
	// Convert to array for Vega-Lite
	let activityData = Object.keys(activityCounts).map(key => ({
		activity: key,
		count: activityCounts[key]
	}));
	
	// Sort by count to find top 3
	activityData.sort((a, b) => b.count - a.count);
	
	// Update DOM with number of different activities
	document.getElementById('numberActivities').innerText = activityData.length;
	
	// Update DOM with top 3 activities
	if (activityData.length >= 1) {
		document.getElementById('firstMost').innerText = activityData[0].activity;
	}
	if (activityData.length >= 2) {
		document.getElementById('secondMost').innerText = activityData[1].activity;
	}
	if (activityData.length >= 3) {
		document.getElementById('thirdMost').innerText = activityData[2].activity;
	}
	
	// Get top 3 activity types
	let top3Activities = activityData.slice(0, 3).map(d => d.activity);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {
	      "field": "activity",
	      "type": "nominal",
	      "title": "Activity Type",
	      "sort": "-y"
	    },
	    "y": {
	      "field": "count",
	      "type": "quantitative",
	      "title": "Number of Tweets"
	    }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	
	// Filter to only top 3 activities with distance > 0
	let top3Tweets = completedTweets.filter(tweet => 
		top3Activities.includes(tweet.activityType) && tweet.distance > 0
	).map(tweet => ({
		activity: tweet.activityType,
		distance: tweet.distance,
		dayOfWeek: tweet.time.toLocaleDateString('en-US', { weekday: 'long' }),
		dayNum: tweet.time.getDay() // 0=Sunday, 1=Monday, etc.
	}));
	
	// Calculate average distances by activity and day for analysis
	let activityStats = {};
	top3Activities.forEach(activity => {
		let activityTweets = top3Tweets.filter(t => t.activity === activity);
		if (activityTweets.length > 0) {
			let totalDistance = activityTweets.reduce((sum, t) => sum + t.distance, 0);
			activityStats[activity] = totalDistance / activityTweets.length;
		}
	});
	
	// Find longest and shortest
	let sortedActivities = Object.keys(activityStats).sort((a, b) => 
		activityStats[b] - activityStats[a]
	);
	
	if (sortedActivities.length >= 1) {
		document.getElementById('longestActivityType').innerText = sortedActivities[0];
	}
	if (sortedActivities.length >= 3) {
		document.getElementById('shortestActivityType').innerText = sortedActivities[sortedActivities.length - 1];
	}
	
	// Calculate weekday vs weekend average
	let weekdayDistances = [];
	let weekendDistances = [];
	
	top3Tweets.forEach(tweet => {
		if (tweet.dayNum === 0 || tweet.dayNum === 6) { // Sunday or Saturday
			weekendDistances.push(tweet.distance);
		} else {
			weekdayDistances.push(tweet.distance);
		}
	});
	
	let weekdayAvg = weekdayDistances.length > 0 ? 
		weekdayDistances.reduce((sum, d) => sum + d, 0) / weekdayDistances.length : 0;
	let weekendAvg = weekendDistances.length > 0 ? 
		weekendDistances.reduce((sum, d) => sum + d, 0) / weekendDistances.length : 0;
	
	document.getElementById('weekdayOrWeekendLonger').innerText = 
		weekdayAvg > weekendAvg ? 'weekdays' : 'weekends';
	
	// Create a single dynamic visualization with parameter binding
	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by day of week for top 3 activities",
		"params": [{
			"name": "showMean",
			"value": false
		}],
		"data": {
			"values": top3Tweets
		},
		"transform": [{
			"calculate": "showMean ? 'mean' : 'all'",
			"as": "aggregationType"
		}],
		"layer": [
			{
				"transform": [{
					"filter": "!showMean"
				}],
				"mark": "point",
				"encoding": {
					"x": {
						"field": "dayOfWeek",
						"type": "nominal",
						"title": "Day of Week",
						"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
					},
					"y": {
						"field": "distance",
						"type": "quantitative",
						"title": "Distance (miles)"
					},
					"color": {
						"field": "activity",
						"type": "nominal",
						"title": "Activity Type"
					}
				}
			},
			{
				"transform": [{
					"filter": "showMean"
				}, {
					"aggregate": [{
						"op": "mean",
						"field": "distance",
						"as": "meanDistance"
					}],
					"groupby": ["dayOfWeek", "activity"]
				}],
				"mark": {
					"type": "point",
					"size": 100
				},
				"encoding": {
					"x": {
						"field": "dayOfWeek",
						"type": "nominal",
						"title": "Day of Week",
						"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
					},
					"y": {
						"field": "meanDistance",
						"type": "quantitative",
						"title": "Distance (miles)"
					},
					"color": {
						"field": "activity",
						"type": "nominal",
						"title": "Activity Type"
					}
				}
			}
		]
	};
	
	// Embed the visualization and get the view
	vegaEmbed('#distanceVis', distance_vis_spec, {
		actions: false,
		config: {
			view: {
				continuousWidth: 400,
				continuousHeight: 300
			}
		}
	}).then(result => {
		const view = result.view;
		
		// Set up button to toggle the parameter
		document.getElementById('aggregate').addEventListener('click', function() {
			const currentValue = view.signal('showMean');
			view.signal('showMean', !currentValue).runAsync();
			
			// Update button text
			this.innerText = !currentValue ? 'Show individual points' : 'Show means';
		});
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});