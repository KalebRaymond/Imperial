/*Code adapted from https://github.com/TriMill/text_replacer (which in turn was adapted from https://github.com/labrose/webextensions-examples)*/

function replaceText (node)
 {
	if (node.nodeType === Node.TEXT_NODE) 
	{
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') 
		{
			return;
		}

    let content = node.textContent;

    content = content.replace('test', 'AAA');
    
    node.textContent = content;
 
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