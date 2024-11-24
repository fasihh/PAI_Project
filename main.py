from model.analysis import Analysis

anal = Analysis()
plots = anal.countplots()

for plot in plots:
    with open(f'{plot}.png', 'wb') as f:
        f.write(plots[plot].getvalue())
