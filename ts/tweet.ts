class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("Watch my") && this.text.includes("right now") || this.text.includes("#RKLive")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved a new personal record")) {
            return "achievement";
        } else if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        } else {
            return "miscellaneous";
        }
    }    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        // Check if there's a dash followed by text before the URL
        if (this.text.includes(" - ")) {
            let parts = this.text.split(" - ");
            if (parts.length >= 2) {
                // Get the text after the dash and before the URL
                let potentialWrittenText = parts[1].split("https://")[0].trim();
                
                // Filter out common default phrases
                let defaultPhrases = [
                    "Check it out!",
                    "TomTom MySports Watch",
                    "with @Runkeeper. Check it out!"
                ];
                
                // If there's text and it's not just a default phrase, it's written
                if (potentialWrittenText.length > 0 && !defaultPhrases.includes(potentialWrittenText)) {
                    return true;
                }
            }
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        if (this.text.includes(" - ")) {
            let parts = this.text.split(" - ");
            if (parts.length >= 2) {
                // Get the text after the dash and before the URL
                let writtenText = parts[1].split("https://")[0].trim();
                return writtenText;
            }
        }
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        // Pattern: "Just completed a 10.00 km run" or "Just posted a 5.00 mi walk"
        // Find the activity type which comes after the distance unit (km/mi)
        
        let text = this.text;
        
        // Look for patterns like "km run", "mi walk", "km bike", etc.
        let kmIndex = text.indexOf(" km ");
        let miIndex = text.indexOf(" mi ");
        
        let startIndex = -1;
        if (kmIndex !== -1 && miIndex !== -1) {
            // Both exist, use the first one
            startIndex = Math.min(kmIndex, miIndex) + 4; // +4 to skip " km " or " mi "
        } else if (kmIndex !== -1) {
            startIndex = kmIndex + 4;
        } else if (miIndex !== -1) {
            startIndex = miIndex + 4;
        }
        
        if (startIndex !== -1) {
            // Extract the activity type (word after km/mi)
            let remainingText = text.substring(startIndex);
            // Get the first word (activity type)
            let activityMatch = remainingText.match(/^(\w+)/);
            if (activityMatch) {
                return activityMatch[1];
            }
        }
        
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        // Pattern: "Just completed a 10.00 km run" or "Just posted a 5.00 mi walk"
        
        let text = this.text;
        
        // Look for number followed by km or mi
        // Match patterns like "10.00 km" or "5.00 mi"
        let kmMatch = text.match(/(\d+\.?\d*)\s*km/);
        let miMatch = text.match(/(\d+\.?\d*)\s*mi/);
        
        if (kmMatch) {
            // Convert km to miles (1 mi = 1.609 km, so divide by 1.609)
            let km = parseFloat(kmMatch[1]);
            return km / 1.609;
        } else if (miMatch) {
            // Already in miles
            return parseFloat(miMatch[1]);
        }
        
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}