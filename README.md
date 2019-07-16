# Scatter Plot Matrix

Scatter Plot Matrix (SPM) is a interactive visualization built with D3.js, it provides a feasible way to explore **correlation** and **distribution** of tabular data with multiple columns.

![](https://github.com/XiancaiTian/Scatter-Plot-Matrix/blob/master/SPM_Shawn.png)

Compared with the one made by D3.js author [Mike Bostock](https://bl.ocks.org/mbostock/4063663), my SPM has the following advantages:

1) you can add or remove attribute you want to explore by double clicking on the column name in the list;

2) categorical attributes will automatically be removed;

3) plot size adjusts based on the number of columns you choose;

4) it shows histogram of each attribute in diagonal cells, instead of pointless scatter plot of the attribute itself;

5) it hides duplicated scatter plots to make the visual a bit neater.
