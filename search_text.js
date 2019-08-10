/*Code adapted from https://github.com/TriMill/text_replacer (which in turn was adapted from https://github.com/labrose/webextensions-examples )*/
/*KNOWN ISSUES: Doesn't put newlines back where they elong
				Puts extraneous spaces into code blocks on webpages (github, stack, etc)
				Doesn't check for cases where there is no space btw number & unit (ex 100kg) */
				
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
			if(content[i] === "kg" && isNumber(content[i - 1]))
			{
				content[i] = content[i].replace("kg", "kg (" + content[i - 1] * 2.205 + " lbs)");
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