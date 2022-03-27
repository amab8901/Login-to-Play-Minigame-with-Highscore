from http.server import HTTPServer, BaseHTTPRequestHandler
from collections import OrderedDict
import webbrowser
import cgi
import cgitb
cgitb.enable()



# import all webpages
Game = open("src/Game.html").read()
GameJS = open("src/Game.js").read()
Username = open("src/Username.html").read()
Password = open("src/Password.html").read()

# List of usernames
userlist = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8',
            'user9', 'user10', 'user11', 'user12', 'user13', 'user14', 'user15']
userinput = "|".join(userlist)

# List of passwords
passlist = ['pass1', 'pass2', 'pass3', 'pass4', 'pass5', 'pass6', 'pass7', 'pass8',
             'pass9', 'pass10', 'pass11', 'pass12', 'pass13', 'user14', 'pass15']

# Ordered dictionary of table values
tableVal = OrderedDict()
for i in range(0, 15):
    tableVal[userlist[i]] = ""
tableVal = list(tableVal.items())

class requestHandler(BaseHTTPRequestHandler):
    def do_GET(self): # put all GET requests in this category

        if self.path.endswith('/Username'): # Display the page for URL: "http://127.0.0.1:8080/Username"
            self.send_response(200)
            self.send_header('content-type', 'text/html')
            self.end_headers()

            output = Username.replace("anvnamn", userinput) # insert list of valid usernames into placeholder.

            self.wfile.write(output.encode())

        if self.path.endswith('/Password'): # Display the page for URL: "http://127.0.0.1:8080/Password"
            self.send_response(200)
            self.send_header('content-type', 'text/html')
            self.end_headers()

            output = Password.replace("losen", reqpass) # insert list of valid passwords into placeholder

            self.wfile.write(output.encode())

        if self.path.endswith('/Game'): # Display the page for URL: "http://127.0.0.1:8080/Game"
            self.send_response(200)
            self.send_header('content-type', 'text/html')
            self.end_headers()

            # Load specified username + Javascript into Game.html
            output = Game\
                .replace("<script></script>", "<script>" + GameJS + "</script>") \

            # insert initial table values
            for i in range(1, 16):
                output = output.replace("score"+str(i)+" ", str(tableVal[i-1][1])) # insert list of scores into placeholders in the table
                output = output.replace("username"+str(i)+" ", tableVal[i-1][0]) # insert list of usernames into placeholders in the table

            output = output.replace("specUser", uservar)

            self.wfile.write(output.encode())

    def do_POST(self): # put all POST requests in this category

        if self.path=="/Password": # Determine whether user is qualified to get redirected to URL: "http://127.0.0.1:8080/Password"
            global uservar
            global reqpass
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST',
                         'CONTENT_TYPE':self.headers['Content-Type']}
            )
            
            # Store user's input username in variable
            uservar = form['user']
            uservar = str(uservar)
            uservar = uservar.replace("FieldStorage('user', None, '", "")
            uservar = uservar.replace("')", "")
            print(uservar)

            # Identify which password that matches the given username
            userindex = userlist.index(uservar)
            reqpass = passlist[userindex]
            print(reqpass)


            self.send_response(301)
            self.send_header('Location', '/Password')
            self.end_headers()

        if self.path=="/Game": # Determine whether user is qualified to get redirected to URL: "http://127.0.0.1:8080/Game"
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST',
                         'CONTENT_TYPE':self.headers['Content-Type']}
            )
            passvar = form['passw']
            passvar = str(passvar)
            passvar = passvar.replace("FieldStorage('passw', None, '", "")
            passvar = passvar.replace("')", "")
            self.send_response(301)
            self.send_header('Location', '/Game')
            self.end_headers()

def main():
    PORT = 8080 # specify which port you want to run the app on
    server_address = ('localhost', PORT)
    server = HTTPServer(server_address, requestHandler)
    print('Server running on port {}'.format(PORT)) # Display in console if the server is running
    webbrowser.open('http://127.0.0.1:8080/Username') # Open the app's URL in browser
    server.serve_forever() # run the app
    
    

if __name__ == "__main__":
    main()
