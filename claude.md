Overall goal: 
This is an webapp that overlays multiple instances of a video on top of itself, with some midifications to some of the instances. 


Details:
There should be a text field where the user can paste in a youtube video url.

The system shoudl take that URL and make the video fill the main part of the screen. Then, it should duplicate that video and overlay it on top of itself. The duplcated video should be color-inverted and have its time offset from the original instance by 1 second. There should be a slider (and a numeric input) to control the time offset. Both instances shoudl start and stop at the same time (with the offset). 

The user should be able to upload a video of their own, and it should be displayed in the same way as the youtube video. Only one youtube link or one uploaded video should be displayed at a time. 

Use Reactjs and Tailwindcss. I want to eventualyl deploy this to github pages, so it needs to be simple and lightweight. 

UI:

------------------------------------------------------------------------------------------------------------------
| [url input] [upload button] ---------- [offset slider] [numeric input] ---------- [play button] [pause button] |
------------------------------------------------------------------------------------------------------------------
|                                                                                                                |
|                                                                                                                |
|                                                                                                                |
|                                                                                                                |
|                                            Video Player                                                        |
|                                                                                                                |
|                                                                                                                |
|                                                                                                                |
|                                                                                                                |
|                                                                                                                |
------------------------------------------------------------------------------------------------------------------
