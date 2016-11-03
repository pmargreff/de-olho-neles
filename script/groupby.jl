using JSON 
using DataFrames 

function groupbystate(df)
  groupdf = by(df, [:state, :year, :month], df -> sum(df[:net_value]))
  
  outputfile = string("data/bystate.csv")
  
  writetable(outputfile, groupdf)
  
end

function groupbycompany(df)  
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
  groupdf = by(df, [:subquota_description,:congressperson_name], df -> sum(df[:net_value]))
  
  rename!(groupdf, :x1, :value)
  rename!(groupdf, :subquota_description, :axis)
  
  outputfile = string("data/bypersonandsubquota.json")
  writejson(outputfile, groupdf)
  
end

function df2json(df::DataFrames.SubDataFrame{Array{Int64,1}})
  len = length(df[:,1])
  indices = names(df)
  name = df[2][1]
  values = [Dict(string(index) => (isna(df[index][i])? nothing : df[index][i])
                     for index in indices)
               for i in 1:len]
                 
  obj = Dict(string("values") => values,string("key") => df[2][1])
                 
  return JSON.json(obj)
end

function writejson(path::String,df::DataFrame)
  dfbyperson = groupby(df, [:congressperson_name])
  size = length(dfbyperson)
  i = 1
  f = open(path,"w")
  
  write(f,"[")
    for subdf in dfbyperson
      write(f,"[")
      write(f,df2json(subdf))
      i == size ? write(f,"]") : write(f,"],")
      i += 1
    end
    write(f,"]")
  close(f)
end


function groupbypersonandstate(df)
  groupdf = by(df, [:state,:congressperson_name], df -> sum(df[:net_value]))

  sort!(groupdf, cols = [order(:state), order(:congressperson_name)])
  
  outputfile = string("data/bypersonandstate.csv")
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
    
    # println("Group by state ...")
    # groupbystate(df)
    # println("Group by state finished.")
    
    # println("Group by company ...")
    # groupbycompany(df)
    # println("Group by company finished.")
    
    println("Group by person and state ...")
    groupbypersonandstate(df)
    println("Group by person and state finished.")
    
    println("Group by person and subquota ...")
    groupbypersonandsubquota(df)
    println("Group by person and subquota finished.")
  else
    println("Params error, check the README file!")
  end
else 
  println("Params error, check the README file!")
end
