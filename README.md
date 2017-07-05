# Scatter Plot Matrix
Scatter Plot Matrix(SPM) is a visual built using D3.js, it provides a way to explore the correlation and distribution of multiple attributes.

<img src="https://github.com/XiancaiTian/Scatter-Plot-Matrix/blob/master/SPM_Shawn.png" alt="SPM" style="width: 100px;height:80px;"/>

Compared with SPM made by [Mike Bostock](https://bl.ocks.org/mbostock/4063663), my SPM has the following advantages:

1) You are free to add and remove attributes form the list;

2) It can detect quantity attributes from source data and quality attributes will not show in the list;

3) Cell size scales down as you add more variables so that users can still have a good overview of all the data;

4) It shows histogram of each attribute in diagonal cells instead of pointless scatter plot of the attribute itself;

5) It hides duplicated scatter plots to make the visual a bit neater.
