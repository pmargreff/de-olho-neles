# !/bin/bash

echo "Unpacking files ..."
unxz $1
unxz $2
unxz $3
echo "Unpack finished."

path1=$(echo -n $1 | head -c -3)
path2=$(echo -n $2 | head -c -3)
path3=$(echo -n $3 | head -c -3)

echo "Moving files ..."
mv $path1 ./data/
mv $path2 ./data/
mv $path3 ./data/
echo "Move finished."

filename1=$(basename "$path1")
filename2=$(basename "$path2")
filename3=$(basename "$path3")

mv ./data/$filename1 ./data/$filename1.csv
mv ./data/$filename2 ./data/$filename2.csv
mv ./data/$filename3 ./data/$filename3.csv

julia script/groupby.jl merge ./data/$filename1.csv ./data/$filename2.csv ./data/$filename3.csv

julia script/groupby.jl create
