#!/bin/bash

HTMLS=$(ls | grep "html")

echo "<html>" > index.html
echo "<body>" >> index.html

for html in $HTMLS;
do
  y=${html%.html}
  echo "<p><a href=\""$html"\">${y##*/}</a></p>" >> index.html
done

echo "</html>" >> index.html
echo "</body>" >> index.html

