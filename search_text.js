/*Code adapted from https://github.com/TriMill/text_replacer (which in turn was adapted from https://github.com/labrose/webextensions-examples )*/
/*KNOWN ISSUES: Totally breaks websites */
				
function isNumber(n)
{
	return !isNaN(n);
}

//Parameters: 	num is a string value of the metric measurement
//				unit is a string containing an SI abbreviation
//Returns a string containing only the the unit and the converted value in imperial. 
//Returned string does not contain the original metric value.
function getConversion(num, unit)
{
	var newLineFlag = true;
	
	if(!unit.includes("~|?"))
	{	
		newLineFlag = false;
		unit += "~|?";
	}
	switch(unit.toLowerCase())
	{
		case "kg~|?":
			unit = unit.replace("kg~|?", "kg (" + (num * 2.205).toFixed(4) + " lbs)");
			break;
		case "g~|?":
			unit = unit.replace("g~|?", "g (" + (num * 0.0353).toFixed(2) + " oz)");
			break;
		case "km~|?":
			unit = unit.replace("km~|?", "km (" + (num * 0.6214).toFixed(4) + " mi)");
			break;
		case "m~|?":
			unit = unit.replace("m~|?", "m (" + (num * 3.2808).toFixed(4) + " ft)");
			break;
		case "cm~|?":
			if(parseInt(num, 10) > 50)
			{
				var inches = num * 0.393701;
				var feet = Math.floor(inches / 12);
				var inches = Math.round(inches % 12);
				
				unit = unit.replace("cm~|?", "cm (" + feet + "'" + inches + "\")");
			}
			else
			{
				unit = unit.replace("cm~|?", "cm (" + (num * 0.3937).toFixed(4) + " in)");
			}
			break;
		case "km/h~|?":
			unit = unit.replace("km/h~|?", "km/h (" + (num * 0.6214).toFixed(4) + " mph)");
			break;
		case "kmh~|?":
			unit = unit.replace("kmh~|?", "kmh (" + (num * 0.6214).toFixed(4) + " mph)");
			break;
	}
	
	if(newLineFlag)
		unit += "~|?";
	
	return unit;
}

function replaceText (node)
{
	if (node.nodeType === Node.TEXT_NODE) 
	{
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') 
		{
			return;
		}
							   
		let content = node.textContent.replace(/\n/g, "~|? ").split(" "); //Replace newlines with spaces, separate text into array of words
		//console.log(content);
		node.textContent = "";
		
		//Iterate over words on page, add conversions where needed, put text back into node.textContent
		for(var i = 0; i < content.length; ++i)
		{	
			
			if(i > 0 && isNumber(content[i - 1]))
			{
				content[i] = getConversion(content[i - 1], content[i]);
			}
			
			//Check for cases where there's no space between number & unit (eg 100kg)
			if(isNumber(content[i].charAt(0)) && isNaN(content[i]))
			{
				var num = "";
				var unit = "";
				for(var j = 0; j < content[i].length; ++j)
				{
					if(isNumber(content[i].charAt(j)))
						num += content[i].charAt(j);
					else
						unit += content[i].charAt(j);
				}
	
				content[i] = num + getConversion(num, unit);
			}
			
			node.textContent += " " + content[i].replace("~|?", "\n");
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