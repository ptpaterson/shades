export const toggle =  bool => !bool

export const inc = num => num + 1

export const always = a => b => a

export const cons = x => xs => ([...xs, x])
