# D3-Scatter-Plot-Matrix
Scatter Plot Matrix(SPM) is a visual component I built for my capstone project, D3.js  is used for building the application.

The object is help to spot collinearity when there are more than a couple of independent variables, by using SPM you can easily explorer the relation between pairs of attributes.

Some of the distinctive features of SPM are listed as follows:

1) Using ajax to load data so you don;t need to wait for browser completing loading all the code;

2) Automatically detect numeric attributes and drop those are not; (Don’t do the stupid thing to map user names as data on a scatter plot!!)

3) There is no limit selecting your desired attributes for exploring, but taking that real-life application always have a view limit such as window size and monitor size, I do set SPM frame as fixed, so cell size will decrease as you add more variables to the matrix;

4) Since there is no meaning exploring the relation between you and yourself, I remove the scatter plot and use histgram instead, telling whether the data is skew or normally distributed.
