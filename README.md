# Programming-Portfolio

This is a minigame I've created using Python, HTML, CSS, JavaScript and http-server. The CSS, JS and HTML are stored in the HTML files, and these .html files are controlled from the .py script. 

In order to login, type any of the following usernames:
user1
user2
[...]
user14
user15

The passwords are any of the following (but it must have the same number as the username):
pass1
pass2
[...]
pass14
pass15

When you log in, you will be taken to the minigame page. The minigame starts automatically when you open the page. The objective in the minigame is to keep the little box alive as long as possible by navigating around the obstacles coming in from the right. This is done by pressing a button under the minigame screen to make the little box move upward. The little box moves down automatically when you release the button (due to gravity). The longer the little box stays alive, the more points you get. You lose when the little box collides with an obstacle.

When you lose the minigame, your score gets registered in the highscore table at the bottom of the minigame page. You can play again by clicking the corresponding button. If you beat your personal record, your new score will replace your previous score in the highscore list. But if you don't beat your personal record, your score in the highscore list will remain unchanged. 

When you log in and play the minigame with a different account, the highscore table from the previous session will remain. If you play the minigame with the new account, your score will be associated with your new account in the highscore list, while the score from the previous account will remain unchanged. If you beat your own personal record, your score will get updated for the account you're currently using. And if you beat the record from previous account(s), your score will be placed above those accounts in the highscore list.
