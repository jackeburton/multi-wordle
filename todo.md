Simplify game connection

player clicks -> new game
ui is created on front end
passes message to backend to create the instance
game Id is updated and put in front end

player clicks -> join game
enters game Id
same process of connect to game - user ID is registered on server
info passed back is either false or packet / connection info

player makes move
delink state management from the ui component
state should be managed by the game wrapper so we can re-use the ui - one instance of wrapper may be 2 player one may be 3 etc
once a move is made we pass that info to the server so the server can update all users UI

map out types better
we should have a consistent game type for the server, when passing updates to the client this should also be made smoother