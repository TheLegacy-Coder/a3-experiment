import pandas as pd

read1900To2020Data = pd.read_csv("public/temperature_data_1900_to_2020.csv")
print(read1900To2020Data)

# Referred to https://stackoverflow.com/questions/39217347/how-to-split-number-to-separate-columns-in-pandas-dataframe for splitting the date elements into separate columns
read1900To2020Data["Date_Copy_String"] = read1900To2020Data["Date"].astype(str)
read1900To2020Data["Year"] = read1900To2020Data["Date_Copy_String"].str[0:4]
read1900To2020Data["Year"] = read1900To2020Data["Year"].astype(int)
read1900To2020Data["Month"] = read1900To2020Data["Date_Copy_String"].str[4:6]
read1900To2020Data.drop("Date_Copy_String", axis=1, inplace=True)
read1900To2020Data.drop("Date", axis=1, inplace=True)

# Referred to https://pandas.pydata.org/docs/reference/api/pandas.Series.map.html for mapping month numerical representations to English
monthMapping = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}
read1900To2020Data["Month"] = read1900To2020Data["Month"].map(monthMapping) 
print(read1900To2020Data)

yearsList = [1900, 1902, 1904, 1906, 1908, 1910, 1912, 1914, 1916, 1918, 1920, 1922, 1924, 1926, 1928, 1930, 1932, 1934, 1936, 1938, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004, 2002, 2000, 1998, 1996, 1994, 1992, 1990, 1988, 1986, 1984, 1982]

for singleYear in yearsList:
    filteredByYear = read1900To2020Data[read1900To2020Data["Year"] == singleYear]
    print(filteredByYear)
    print("\n\n")
    filteredByYear.to_csv(f"public/csvFiles/temperature_data_{singleYear}.csv")
