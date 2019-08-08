/*Code adapted from https://github.com/TriMill/text_replacer (which in turn was adapted from https://github.com/labrose/webextensions-examples )*/

function replaceText (node)
 {
	if (node.nodeType === Node.TEXT_NODE) 
	{
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') 
		{
			return;
		}
							   
		let content = node.textContent.split(" "); //Sweet, content is an array of strings. Just itereate over each word
		node.textContent = "";
		
		//Iterate over words on page, add conversions where needed, put text back into node.textContent
		for(var i = 0; i < content.length; ++i)
		{
			/*if(content[i] === "kg")
			{
				console.log(content[i]);
			}*/
			
			content[i] = content[i].replace("test", "AAA");
			node.textContent  += content[i] + " "; //Don't forget to set the textContent equal to the work you just did
												   //THIS CODE ADDS SPACES IN CODE??????? SEE TriMill GITHUB!!!!
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