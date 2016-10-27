using DataFrames

function groupbystate(df, name)
  groupdf = by(df, [:state], df -> sum(df[:net_value]))
  
  outputfile = string("data/",name,"bystate.csv")

  writetable(outputfile, groupdf)

end

function groupbyperson(df, name)
  groupdf = by(df, [:congressperson_name], df -> sum(df[:net_value]))
  
  outputfile = string("data/",name,"byperson.csv")

  writetable(outputfile, groupdf)

end

function groupbypersonandsubquota(df, name)
  groupdf = by(df, [:congressperson_name, :subquota_description], df -> sum(df[:net_value]))
  
  outputfile = string("data/",name,"bypersonandsubquota.csv")

  writetable(outputfile, groupdf)

end


function main()
  inputfile = "2015"
  inputpath = string("data/",inputfile,".csv")
  
  df = readtable(inputpath)
  
  groupbystate(df, inputfile)
  # groupbyperson(df, inputfile)
  # groupbypersonandsubquota(df, inputfile)
end

main()
