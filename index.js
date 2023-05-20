import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

localStorage.setItem("Tweets", JSON.stringify(tweetsData))
// let localTweets = tweetsData
let localTweets = JSON.parse(localStorage.getItem("Tweets"))


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
     else if(e.target.dataset.deleteTweet){
        handleDeleteTweetClick(e.target.dataset.deleteTweet)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
    
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = localTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = localTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = localTweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    console.log(`replying to ${targetTweetObj.handle}`)
   
    const replyInput = document.getElementById('reply-input')

    if(replyInput.value){
        targetTweetObj.replies.push(
                {
                handle: `@Replyguy`,
                profilePic: `images/tcruise.png`,
                tweetText: replyInput.value,
                }
        )
    replyInput.value = ''
    }
    render()
}   
function handleDeleteTweetClick(tweetId){
    localTweets = localTweets.filter(function(tweet){
        return tweet.uuid != tweetId
    })
    render()


// Pass the removeValue function into the filter function to return the specified value

  
    
    // maybe use .map on localTweets where the uuid is not the current tweetId? or a forEach?
        //document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}


function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        localTweets.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    localTweets.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash"
                    data-delete-tweet="${tweet.uuid}"
                    ></i>
                    
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <textarea placeholder="Reply to ${tweet.handle}" id="reply-input"></textarea>
        <button id="reply-btn" data-replybtn="${tweet.uuid}">Reply</button>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    localStorage.setItem("Tweets", JSON.stringify(localTweets))
    document.getElementById('feed').innerHTML = getFeedHtml()

}

render()

