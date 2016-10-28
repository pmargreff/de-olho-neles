using DataFrames

function groupbystate(df, name)
  groupdf = by(df, [:state], df -> sum(df[:net_value]))
  
  outputfile = string("data/",name,"bystate.csv")

  writetable(outputfile, groupdf)

end

function groupbycompany(df, name)
  groupdf = by(df, [:supplier], df -> sum(df[:net_value]))
  
  nrows, ncolumns = size(groupdf)
  outputfile = string("data/bycompany",name,".csv")
  sort!(groupdf, cols = [order(:x1)])
  
  deleterows!(groupdf, 1:nrows - 100)
  
  writetable(outputfile, groupdf)

end

function groupbypersonandsubquota(df, name)
  groupdf = by(df, [:congressperson_name, :subquota_description], df -> sum(df[:net_value]))
  
  outputfile = string("data/bypersonandsubquota",name,".csv")

  writetable(outputfile, groupdf)

end


function main()
  inputfile = "2015"
  inputpath = string("data/",inputfile,".csv")
  
  df = readtable(inputpath)
  
  # groupbystate(df, inputfile)
  groupbycompany(df, inputfile)
  # groupbypersonandsubquota(df, inputfile)
end

main()
