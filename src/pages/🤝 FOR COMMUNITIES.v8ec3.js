// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world


const toggleExpanding = (btn, textEl) => {
    // const textEl = $w("#textExpandable");
    // console.log(textEl);
    if (textEl.customClassList.contains("clamp-text")) {
      textEl.customClassList.remove("clamp-text");
      btn.label = "Show less";
    } else {
      textEl.customClassList.add("clamp-text");
      btn.label = "Tell me more";
    }
  }

$w.onReady(function () {
    $w("#readMore").onClick(() => toggleExpanding($w("#readMore"), $w("#textExpandable")));
    $w("#readMore2").onClick(() => toggleExpanding($w("#readMore2"), $w("#textExpandable2")));

    $w("#openInfo").onClick(() => {
    const isCollapsed = $w("#communitiesInfo").collapsed;
    if (isCollapsed) {
      $w("#communitiesInfo").expand();
      $w("#openInfo").label = "Show less";
    } else {
      $w("#communitiesInfo").collapse();
      $w("#openInfo").label = "More ...";
    }
});

$w("#introVideoProgress").value = 5;
});