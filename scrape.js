const fs = require('fs');
const puppeteer = require('puppeteer'); // Require the Package we need...

let scrape = async () => { // Prepare scrape...

	const browser = await puppeteer.launch({args: ['--no-sandbox', '--disabled-setuid-sandbox', '--disable-translate']}); // Prevent non-needed issues for *NIX
	const page = await browser.newPage(); // Create request for the new page to obtain...

  await page.goto('https://www.google.com/maps/place/Sk%C3%B3gafoss/@63.5320147,-19.513565,345m/data=!3m1!1e3!4m7!3m6!1s0x48d73b7639a58c15:0xf60c71fcdfe7948!8m2!3d63.5320523!4d-19.5113706!9m1!1b1'); // Define the Maps URL to Scrape...
  await page.waitFor(5000); // In case Server has JS needed to be loaded...

	const results = await page.evaluate(() => { // Let's create variables and store values...
	  let texts = document.querySelectorAll( '.section-review-text' );

		let reviews = [ ];
		for ( var i=0; i<texts.length; i++ ) {
			let text = texts[ i ].innerText;
			text = text.replace( /(\r\n|\n\r|\n|\r|\t)/gm, " " );
			text = text.split( " (Origineel) " ).pop( );
			text = text.replace( "(Vertaald door Google) ", "" );

			text = text.replace( / , /g, ', ' );
			text = text.replace( / . /g, ', ' );
			text = text.replace( /  /g, ' ' );
			// text = text.replace( "  ", " " );
			// text = text.replace( " , ", ", " );
			// text = text.replace( " . ", ". " );
			text = text.trim( );

			if ( text != "" ) reviews.push( text );
		}

		return reviews;
	} );

	browser.close(); // Close the Browser...
	return results; // Return the results with the Review...
};

scrape().then((value) => { // Scrape and output the results...
	console.log('value', value); // Yay, output the Results...

	fs.writeFile('./data/review_texts.js', "var review_texts = " + JSON.stringify(value, null, 2) + ";", function(err){
		console.log("file is written!");
	});
});

//res.send(texts);
