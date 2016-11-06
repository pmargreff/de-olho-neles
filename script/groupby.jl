using JSON 
using DataFrames 

function groupbystate(df)
  groupdf = by(df, [:state, :year, :month, :congressperson_name], df -> sum(df[:net_value]))
  
  groupbypeople = by(groupdf, [:state, :year, :month], nrow)
  groupbyvalue = by(df, [:state, :year, :month], df -> sum(df[:net_value]))
  groupbyvalue[:people] = map((x) -> x, groupbypeople[:x1])
  groupbyvalue[:mean] = map((x,y) -> x/y, groupbyvalue[:x1], groupbyvalue[:people])
  
  maxvaluefile = string("data/maxvaluebystate.csv")
  maxvaluedf = readtable(maxvaluefile)

  groupbyvalue[:percent] = map((x) -> x, groupbyvalue[:mean])
  
  for rowdata in eachrow(groupbyvalue)
    for rowvalue in eachrow(maxvaluedf)
      if string(rowdata[:state]) == string(rowvalue[:state])
        rowdata[:percent] = rowdata[:mean] / rowvalue[:max_value]  
      end
    end
  end
  
  outputfile = string("data/bystate.csv")
  writetable(outputfile, groupbyvalue)
  
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

function grouptotalbytime(df)
  groupdf = by(df, [:year,:month], df -> sum(df[:net_value]))
  
  groupdf[:date] = map((x,y) -> string(x,"-",y), groupdf[:year], groupdf[:month])
  delete!(groupdf, :month)
  delete!(groupdf, :year)
  
  outputfile = string("data/totalbytime.csv")
  writetable(outputfile, groupdf)
end

function findstringarray(ary, s)
   res = Any[]
   for e in ary
     if contains(string(e), string(s)) && length(strip(string(e))) == length(strip(string(s)))  
       push!(res, true)
     else
       push!(res, false)
     end
   end
   return res
end

function groupbyparty(df)
  
  groupdf = by(df, [:year,:month, :party, :congressperson_name], df -> sum(df[:net_value]))
  groupdf = by(groupdf, [:year,:month, :party], groupdf -> mean(groupdf[:x1]))
  
  groupfaults = groupby(groupdf, [:year, :month])
  
  dfparties = by(df, [:party], df -> sum(df[:net_value]))
  outputfile = string("data/parties.csv")

  arrparty = dfparties[:party]
    
  outputfile = string("data/byparty.csv")
  for subdf in groupfaults
    for party in arrparty
      if size(subdf[find(findstringarray(subdf[:,:party], party)), :],1) == 0
        push!(groupdf, @data([subdf[1, :year], subdf[1 ,:month], string(party), 0.0]))
      end
    end
  end

  sort!(groupdf, cols = [order(:year), order(:month)])
  
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
    
    # println("Group by date ...")
    # groupbyparty(df)
    # println("Group by date finished")
    # 
    # println("Group by date ...")
    # grouptotalbytime(df)
    # println("Group by date finished")
    
    println("Group by state ...")
    groupbystate(df)
    println("Group by state finished.")
    
    # println("Group by company ...")
    # groupbycompany(df)
    # println("Group by company finished.")
    
    # println("Group by person and state ...")
    # groupbypersonandstate(df)
    # println("Group by person and state finished.")
    
    # println("Group by person and subquota ...")
    # groupbypersonandsubquota(df)
    # println("Group by person and subquota finished.")
  else
    println("Params error, check the README file!")
  end
else 
  println("Params error, check the README file!")
end
