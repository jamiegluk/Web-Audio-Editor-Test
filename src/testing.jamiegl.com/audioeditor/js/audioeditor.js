/*
	audioeditor.js
	Main site script
  Audio Editor Test
  Jamie Lievesley (1301781@uad.ac.uk, jamie@jamiegl.co.uk)
  17 May 2017 19:00
*/



/* Tracks that have been added. */
var g_tracklist = [];

/* Set to true when playing. */
var g_playing = false;

/* DnD uses a timeout on drag-exit to prevent flickering on Chrome end Edge. */
var g_dragExitTimeout = null;


// Triggered when a file is dragged enter or over the document
function onDragInside(e) {
  e.stopPropagation();
  e.preventDefault();

  clearTimeout(g_dragExitTimeout);
  $('main').addClass('dropzone-ready');

  var types = e.originalEvent.dataTransfer.types;
  for (var i=0; i < types.length; i++) {
    if(types[i].indexOf('audio') > -1) {
      return true;
    }
  }
  return false;
}


// Triggered when sound files are successfully chosen
function onSoundFilesSelected(files) {
  for (var i=0; i < files.length; i++) {
    var file = files[i];
    if(file.type.indexOf('audio') > -1) {
      loadSoundFile(file);
    }
  }
}


// loads an individual sound file to a new audio track
function loadSoundFile(file) {
  console.log("Loading audio file: " + file.name);

  // Add to our tracklist
  var track = {
    filename: file.name,
    wave:     null, // Can't create until we create the container (below)
    muted:    false,
    number:   g_tracklist.length + 1
  };
  g_tracklist.push(track);

  // Generate clean title from filename
  var title = generateTitleForTrack(track);
  var id = "container-track-" + track.number;

  // Create track GUI
  var $item = $("#container-track-template").clone().attr("id", id)
              .attr("data-track-num", track.number).removeClass("hidden");
  $item.find(".mdc-card__primary input").val(title);

  // Create audio object
  var wavesurfer = WaveSurfer.create({
    container:     $item.find(".track-waveform").get(0),
    waveColor:     '#3F51B5',
    progressColor: '#303F9F',
    cursorColor:   '#009688',
    hideScrollbar: true,
    scrollParent:  true,
    autoCenter:    true,
    fillParent:    false,
  });
  wavesurfer.loadBlob(file);
  track.wave = wavesurfer;

  // Seek tracks equally
  var lastSeek = 0;
  wavesurfer.on("seek", function(progress) {
    // Calling seekTo within this causes event recursion (yuck)
    // So, set a timeout for seek events
    thisSeek = Date.now();
    if(thisSeek - lastSeek < 10) {
      lastSeek = thisSeek;
      return false;
    }
    lastSeek = thisSeek;
    // Get triggering waveforms time
    var secs = wavesurfer.getCurrentTime();
    for(var i=0; i<g_tracklist.length; i++) {
      var wave2 = g_tracklist[i].wave;
      // Match other waveform up
      var duration = wave2.getDuration();
      if(secs >= duration) {
        wave2.seekTo(1);
        wave2.pause();
      } else {
        wave2.seekTo(1.0 * secs / duration);
        // Start playing wave again if stopped
        if(g_playing) {
          wave2.play();
        }
      }
    }
  });

  // Catch this track playing finished
  wavesurfer.on("finish", function(e) {
    // Loop through all tracks to see if any are still playing
    for(var i=0; i<g_tracklist.length; i++) {
      var wave2 = g_tracklist[i].wave;
      if(wave2.isPlaying()) {
        // A track is still playing, don't do anything
        return;
      }
    }
    // All tracks are finished, mark as stopped
    stop();
  });

  // Add track GUI item at end of current tracks
  $("#container-add").before($item);

  // Initialise events
  window.mdc.autoInit();
  $item.find(".action-remove").on("click", function() {
    removeTrack(track);
  });
  $item.find(".action-mute").on("click", function() {
    toggleTrackMute(track);
  });

} // END FUNCTION loadSoundFile


// Takes a track and creates a displayable non-conflicting track title from it
function generateTitleForTrack(track) {
  var title = track.filename.trim().replace(/\.[^.]*$/, ""); // removes file extension
  if(title.length <= 0) {
    // Give it a numbered title instead if now empty
    title = "Track " + track.number;
  }
  // Prevent conflicts with existing titles
  var origTitle = title;
  var i=1;
  while(true) {
    var matched = false;
    $(".container-track:not(#container-track-template)").each(function() {
      var t = $(this).find(".mdc-card__primary input").val();
      if(t == title) {
        matched = true;
        return false; // Break jQuery each
      }
    });
    if(!matched) {
      break; // Break while(true)
    }
    if(i > 1) {
      title = origTitle + " (" + i + ")";
    }
    i++;
  }
  return title;
} // END FUNCTION generateTitleForTrack


// Removes an audio track from use
function removeTrack(track) {
  // Destroy audio object
  track.wave.destroy();
  // Remove from tracklist
  var index = g_tracklist.indexOf(track);
  g_tracklist.splice(index, 1);
  // Remove GUI item
  $(".container-track[data-track-num=" + track.number + "]").remove();
}

// Mutes/Unmutes an audio track
function toggleTrackMute(track) {
  // Update audio
  track.muted = !track.muted;
  if(track.muted) {
    track.wave.setVolume(0);
  } else {
    track.wave.setVolume(1);
  }
  // Update GUI item
  $(".container-track[data-track-num=" + track.number + "] .action-mute")
      .html(track.muted ? 'UNMUTE' : 'MUTE');
}

// Either plays/stops depending on current state
function togglePlay() {
  if(g_playing) {
    stop();
  } else {
    play();
  }
}


// Plays all tracks together
function play() {
  g_playing = true;

  // First change FAB to stop button
  $(".mdc-fab__icon").html("stop");

  // Play each track
  for(var i=0; i<g_tracklist.length; i++) {
    var wave = g_tracklist[i].wave;
    wave.play();
  }
}


// Plays all tracks together
function stop() {
  g_playing = false;

  // First change FAB to play button
  $(".mdc-fab__icon").html("play_arrow");

  // Now stop each track
  for(var i=0; i<g_tracklist.length; i++) {
    var wave = g_tracklist[i].wave;
    wave.stop();
  }
}


$(function() {

  // Initialise material design
  var toolbar = mdc.toolbar.MDCToolbar.attachTo(document.querySelector('.mdc-toolbar'));
  toolbar.fixedAdjustElement = document.querySelector('.mdc-toolbar-fixed-adjust');
  window.mdc.autoInit();

  // Allow sound file drag and drop
  var timeout = null;
  var dragzone = $(document);
  dragzone.on('dragenter', function (e) {
    e.originalEvent.dataTransfer.effectAllowed = "link";
    return onDragInside(e);
  })
  .on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = "link";
    return onDragInside(e);
  })
  .on('dragleave dragexit dragend', function (e) {
    e.stopPropagation();
    e.preventDefault();
    clearTimeout(g_dragExitTimeout);
    g_dragExitTimeout = setTimeout(function() {
      $('main').removeClass('dropzone-ready');
    }, 100);
  })
  .on('drop', function (e) {
    e.preventDefault();
    $('main').removeClass('dropzone-ready');
    var files = e.originalEvent.dataTransfer.files;
    onSoundFilesSelected(files);
  });
  // Sometimes drag-exit fucks up, let the user click the overlay to get rid of it
  $("#overlay-dropzone-ready").click(function() {
    $("main").removeClass("dropzone-ready");
  });

  // Make BROWSE action button work
  $("#container-add button").click(function() {
    $("#add-file-input").click();
  });
  $('#add-file-input').on("change", function(){
    var files = $(this).prop("files");
    onSoundFilesSelected(files);
  });

});
