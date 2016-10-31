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

function groupbypersonandsubquota(df)
  groupdf = by(df, [:congressperson_name, :subquota_description], df -> sum(df[:net_value]))
  
  outputfile = string("data/bypersonandsubquota.csv")
  
  writetable(outputfile, groupdf)
  
end

function merge_dataframes(files)
  
  newdf = readtable(files[2])
  if length(files) > 2
    for i in 3:length(files)
      concatdf = readtable(files[i])
      newdf = vcat(newdf, concatdf)
    end
  end
  
  outputfile = string("data/final.csv")
  writetable(outputfile, newdf)
  
  return outputfile
end


if length(ARGS) != 0
  if ARGS[1] == "merge"
    println("please wait, creating file ...")
    merge_dataframes(ARGS)
    println("file created")
  elseif ARGS[1] == "create"
    
    finalfile = string("data/final.csv")
    
    println("Loading file ...")
    df = readtable(finalfile)
    println("File loaded.")
    
    println("Group by state ...")
    groupbystate(df)
    println("Group by state finished.")
    
    println("Group by company ...")
    groupbycompany(df)
    println("Group by company finished.")
    
    println("Group by person ...")
    groupbypersonandsubquota(df)
    println("Group by person finished.")
  else
    println("Params error, check the README file!")
  end
else 
  println("Params error, check the README file!")
end
