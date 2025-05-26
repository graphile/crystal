An ActiveCrawler's bestFriend can only be an ActiveCrawler  
An NPC's bestFriend can be any Character  
This means different numbers of polymorphic boundaries are passed in each case.

As of May 2025, this means the plan has two parallel paths, but in the future we
may be able to have this collapse back down to one while fetching the items of
each of the bestFriends.

```mermaid
  graph TD

  subgraph NPC_Graph
  Access_bestFriend_1 --> extractCrawlerID_1 & extractNpcID
  extractCrawlerID_1 --> ActiveCrawler_1
  extractNpcID --> Manager_or_Staff
  Manager_or_Staff & ActiveCrawler_1 --> Combined
  Combined --> Equipment_1 & Consumable_1 & MiscItem_1 & UtilityItem_1
  end

  subgraph ActiveCrawler_Graph
  Access_bestFriend_2 --> extractCrawlerID_2
  extractCrawlerID_2 --> ActiveCrawler_2
  ActiveCrawler_2 --> Equipment_2 & Consumable_2 & MiscItem_2 & UtilityItem_2
  end

```

NB: Although the last nodes are called `Equipment_1` and `Equipment_2`, these
nodes should in the future collapse down such that `Combined` and
`ActiveCrawler_2` go to the same nodes.
