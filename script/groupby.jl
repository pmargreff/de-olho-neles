using DataFrames

function groupbystate(df)
  groupdf = by(df, [:state, :year, :month], df -> sum(df[:net_value]))
  
  outputfile = string("data/bystate.csv")
  
  writetable(outputfile, groupdf)
  
end

function groupbycompany(df)
  # agrupar por ano - ok
  # somar sem mais custosos - ok
  # concatenar arquivo
  
  dffinal = DataFrame()
  dffinal[:supplier] = ["p"]
  dffinal[:x1] = 1:1
  dffinal[:cnpj_cpf] = ["p"]
  dffinal[:year] = 1:1
  deleterows!(dffinal, 1:1)
  
  dfbyyear = groupby(df, [:year])
  
  dfbysupplier = groupby(df, [:supplier])
  
  
  for subdf in dfbyyear
    year = (subdf[[1], [:year]])
    groupdf = by(subdf, [:supplier], subdf -> sum(subdf[:net_value]))
    sort!(groupdf, cols = [order(:x1)])
    
    nrows, ncolumns = size(groupdf)
    deleterows!(groupdf, 1:nrows - 100)
    
    groupdf[:cnpj_cpf] = map((x) -> x, string("NA"))    
    groupdf[:year] = map((x) -> x, year[:year][1])    
    
    for row in eachrow(groupdf)
      for item in dfbysupplier
        itemname = item[:supplier]
        if itemname[1] == row[:supplier] 
          ident = item[:cnpj_cpf]
          row[:cnpj_cpf] = string(ident[1])
        end
      end
    end
    
    dffinal = vcat(dffinal, groupdf)
  end
  
  outputfile = string("data/bycompany.csv")
  writetable(outputfile, dffinal)
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
  
  # groupbystate(df)
  groupbycompany(df)
  # groupbypersonandsubquota(df, inputfile)
  
end

main()
