#!/bin/bash

HTMLS=$(ls | grep "html")

echo "<html>" > index.html
echo "<body>" >> index.html

for html in $HTMLS;
do 
  echo "<p><a href=\""$html"\">$html</a></p>" >> index.html
done

echo "</html>" >> index.html
echo "</body>" >> index.html

