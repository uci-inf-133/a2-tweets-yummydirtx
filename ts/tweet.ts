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
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}