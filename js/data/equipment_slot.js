var EquipmentSlotType = Object.freeze({
  Head: "Head",
  Neck: "Neck",
  Arm: "Arm",
  Forearm: "Forearm",
  Hand: "Hand",
  Legs: "Legs",
  Feet: "Feet",
  Torso: "Torso",
  Finger: "Finger",
  Waist: "Waist",
  Primary: "Primary",
  Secondary: "Secondary"
});

var EquipmentSlot = function(id, type)
{
  this.id = id;
  this.type = type;
  this.slotIndex = -1;
  this.itemId = null;
};