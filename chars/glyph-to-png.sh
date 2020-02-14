#! /bin/sh

declare -A PUNCT=( [p1]="." [p2]=":" [p3]="," [p4]=";" [p5]="(" [p6]="*" [p7]="!" [p8]="?" [p9]=")" )
POINTS=24

for i in {A..Z}; do convert -background none -fill black -font /home/nunof/.local/share/fonts/Brown-Regular.otf -pointsize ${POINTS} label:"$i" "$i".png; done; 

for i in {a..z}; do convert -background none -fill black -font /home/nunof/.local/share/fonts/Brown-Regular.otf -pointsize $POINTS label:"$i" "$i".png; done; 

for i in {0..9}; do convert -background none -fill black -font /home/nunof/.local/share/fonts/Brown-Regular.otf -pointsize $POINTS label:"$i" "$i".png; done;

for i in "${!PUNCT[@]}"; do convert -background none -fill black -font /home/nunof/.local/share/fonts/Brown-Regular.otf -pointsize $POINTS label:"$PUNCT[$1]" "$i".png; done;  

echo "Done!"
