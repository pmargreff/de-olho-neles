using DataFrames

function groupbystate(df)
  groupdf = by(df, [:state, :year, :month], df -> sum(df[:net_value]))
  
  outputfile = string("data/bystate.csv")
  
  writetable(outputfile, groupdf)
  
end

function groupbycompany(df, name)
  groupdf = by(df, [:supplier], df -> sum(df[:net_value]))
  
  nrows, ncolumns = size(groupdf)
  outputfile = string("data/bycompany",name,".csv")
  sort!(groupdf, cols = [order(:x1)])
  
  deleterows!(groupdf, 1:nrows - 100)
  
  groupdf[:cnpj_cpf] = map((x) -> x, string("NA"))
  groupbydf = groupby(df, [:supplier])
  
  for row in eachrow(groupdf)
    for item in groupbydf
      itemname = item[:supplier]
      if itemname[1] == row[:supplier] 
        ident = item[:cnpj_cpf]
        row[:cnpj_cpf] = string(ident[1])
      end
    end
  end

  writetable(outputfile, groupdf)
end

function groupbypersonandsubquota(df, name)
  groupdf = by(df, [:congressperson_name, :subquota_description], df -> sum(df[:net_value]))
  
  outputfile = string("data/bypersonandsubquota",name,".csv")
  
  writetable(outputfile, groupdf)
  
end

function merge_dataframes(file1, file2, file3)
  
  df1 = readtable(file1)
  df2 = readtable(file2)
  df3 = readtable(file3)

  newdf = vcat(df1, df2)
  newdf = vcat(newdf, df3)
  
  outputfile = string("data/allyearsdata.csv")
  writetable(outputfile, newdf)
  
  return outputfile
end

function main()
  # inputfile1 = "2016-08-08-previous-years"
  # inputfile2 = "2016-08-08-last-year"
  # inputfile3 = "2016-08-08-current-year"
  # inputpath1 = string("data/",inputfile1,".csv")
  # inputpath2 = string("data/",inputfile2,".csv")
  # inputpath3 = string("data/",inputfile3,".csv")
  
  # merge_dataframes(inputpath1, inputpath2, inputpath3)
  finalfile = string("data/allyearsdata.csv")
  df = readtable(finalfile)
  
  groupbystate(df)
  # groupbycompany(df, inputfile)
  # groupbypersonandsubquota(df, inputfile)
  
end

main()
