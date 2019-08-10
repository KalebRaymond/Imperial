/*Code adapted from https://github.com/TriMill/text_replacer (which in turn was adapted from https://github.com/labrose/webextensions-examples )*/
/*KNOWN ISSUES: Doesn't put newlines back where they elong
				Puts extraneous spaces into code blocks on webpages (github, stack, etc)
				Doesn't check for cases where there is no space btw number & unit (ex 100kg) 
				Makes youtube crash*/
				
function isNumber(n)
{
	return !isNaN(n);
}

function replaceText (node)
 {
	if (node.nodeType === Node.TEXT_NODE) 
	{
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') 
		{
			return;
		}
							   
		let content = node.textContent.replace(/\n/g, " ").split(" "); //Replace newlines with spaces, separate text into array of words
		node.textContent = "";
		
		//Iterate over words on page, add conversions where needed, put text back into node.textContent
		node.textContent  += content[0] + " "; 
		for(var i = 1; i < content.length; ++i)
		{	
			if(isNumber(content[i - 1]))
			{
				switch(content[i].toLowerCase())
				{
					case "kg":
						content[i] = content[i].replace("kg", "kg (" + (content[i - 1] * 2.205).toFixed(4) + " lbs)");
						break;
					case "g":
						content[i] = content[i].replace("g", "g (" + (content[i - 1] * 0.0353).toFixed(2) + " oz)");
						break;
					case "km":
						content[i] = content[i].replace("km", "km (" + (content[i - 1] * 0.6214).toFixed(4) + " mi)");
						break;
					case "m":
						content[i] = content[i].replace("m", "m (" + (content[i - 1] * 3.2808).toFixed(4) + " ft)");
						break;
					case "cm":
						if(parseInt(content[i - 1], 10) > 50)
						{
							var inches = content[i - 1] * 0.393701;
							var feet = Math.floor(inches / 12);
							var inches = Math.round(inches % 12);
							
							content[i] = content[i].replace("cm", "cm (" + feet + "'" + inches + "\")");
						}
						else
						{
							content[i] = content[i].replace("cm", "cm (" + (content[i - 1] * 0.3937).toFixed(4) + " in)");
						}
						break;
					case "km/h":
						content[i] = content[i].replace("km/h", "km/h (" + (content[i - 1] * 0.6214).toFixed(4) + " mph)");
						break;
					case "kmh":
						content[i] = content[i].replace("kmh", "kmh (" + (content[i - 1] * 0.6214).toFixed(4) + " mph)");
						break;
				}
			}
			
			node.textContent  += content[i] + " "; 
		}
	}
	else 
	{
		for (let i = 0; i < node.childNodes.length; i++) 
		{
			replaceText(node.childNodes[i]);
		}    
	}
}

replaceText(document.body);

const observer = new MutationObserver((mutations) => 
{
	mutations.forEach((mutation) => 
	{
		if (mutation.addedNodes && mutation.addedNodes.length > 0) 
		{
			for (let i = 0; i < mutation.addedNodes.length; i++) 
			{
				const newNode = mutation.addedNodes[i];
				replaceText(newNode);
			}
		}
	});
});

observer.observe(document.body, { childList: true, subtree: true });