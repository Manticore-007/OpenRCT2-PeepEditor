import { Colour, compute, store } from "openrct2-flexui";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { guestItemTypeList } from "../helpers/guestItemTypes";
import { peepSpeedExecuteArgs } from "../actions/peepSpeed";
import { namePeepExecuteArgs } from "../actions/peepNamer";
import { debug } from "../helpers/logger";
import { getAllRides, ParkRide } from "../objects/parkRides";
const windowTitle = "Peep Editor";

type PeepMotion = "frozen" | "static" | "moving"

export class peepViewModel
{
    //general

    readonly _selectedPeep = store<Guest | Staff | undefined>(undefined);
    readonly _name = store<string>(windowTitle);
    readonly _destination = store<CoordsXYZ | null>(null);
    readonly _energy = store<number>(0);
    readonly _energyTarget = store<number>(96);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _availableAnimations = store<GuestAnimation[] | StaffAnimation[]>([]);
    readonly _animationFrame = store<number>(0);
    readonly _animationLength = store<number>(1);
    readonly _animation = store<GuestAnimation | StaffAnimation>();


    //staff
    
    readonly _staffType = store<StaffType>("handyman");
    readonly _colour = store<number>(100);
    readonly _availableCostumes = store<StaffCostume[]>([]);
    readonly _costume = store<StaffCostume>("none");
    readonly _orders = store<number>(0);
    readonly _patrolArea = store<PatrolArea | null>(null);
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);


    //guest

    readonly _tshirtColour = store<number>(19);
    readonly _trousersColour = store<number>(19);
    readonly _balloonColour = store<number>(19);
    readonly _hatColour = store<number>(19);
    readonly _umbrellaColour = store<number>(19);
    readonly _happiness = store<number>(0);
    readonly _happinessTarget = store<number>(0);
    readonly _nausea = store<number>(0);
    readonly _nauseaTarget = store<number>(0);
    readonly _hunger = store<number>(255);
    readonly _thirst = store<number>(255);
    readonly _toilet = store<number>(0);
    readonly _mass = store<number>(0);
    readonly _minIntensity = store<number>(0);
    readonly _maxIntensity = store<number>(0);
    readonly _nauseaTolerance = store<number>(0);
    readonly _cash = store<number>(0);
    readonly _isInPark = store<boolean>(false);
    readonly _isLost = store<boolean>(false);
    readonly _lostCountdown = store<number>(0);
    readonly _thoughts = store<Thought[]>([]);
    readonly _items = store<GuestItem[]>([]);
    readonly _hasItem = store<boolean[]>([]);
    readonly _hasHat = store<boolean>(false);
    readonly _hasBalloon = store<boolean>(false);
    readonly _hasUmbrella = store<boolean>(false);
    readonly _availableGuestAnimations = store<GuestAnimation[]>([]);
    readonly _flags = store<number>(0);
    readonly _photo1RideName = store<string>("");
    readonly _photo2RideId = store<number>();
    readonly _photo3RideId = store<number>();
    readonly _photo4RideId = store<number>();
    readonly _item = store<GuestItemType>("balloon");
    readonly _rideId = store<number>(0);
    readonly _voucher = store<Voucher>(<Voucher>{type: "voucher", voucherType: "entry_free"});
    readonly _voucherItem = store<GuestItemType>("balloon");
    readonly _voucherType = store<VoucherType>("entry_free");


    //custom

    readonly _image = store<number>(6430 | (Colour.SalmonPink) << 19 | (Colour.SalmonPink << 24) | (0b111 << 29));
    readonly _peepFace = store<ImageAnimation>();
    readonly _isGuest = store<boolean>(false);
    readonly _isStaff = store<boolean>(false);
    readonly _isHandyman = store<boolean>(false);
    readonly _isMechanic = store<boolean>(false);
    readonly _isSecurity = store<boolean>(false);
    readonly _isEntertainer = store<boolean>(false);
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = store<boolean>(false);
    readonly _isStatic = store<boolean>(false);
    readonly _isPeepSelected = compute(this._selectedPeep, p => p ? true : false);
    readonly _allGuestsSelected = store<boolean>(false);
    readonly _allGuests = store<Entity[]>([]);
    readonly _rideList = store<ParkRide[]>([]);
    readonly _selectedRide = store<[ParkRide, number] | null>(null);

    private _onGameTick?: IDisposable;

    _open(): void
    {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted());
        this._rideList.subscribe(r => {
            let selection: [ParkRide, number] | null = null;
            if (r.length > 0)
            {
                const previous = this._selectedRide.get();
                const selectedIdx = (previous && previous[1] < r.length) ? previous[1] : 0;
                selection = [ r[selectedIdx], selectedIdx ];
            }
            this._selectedRide.set(selection);
        });        
        this._rideList.set(getAllRides());
    }

    _reset(): void
    {
        this._selectedPeep.set(undefined);
        this._isFrozen.set(false);
        this._isStatic.set(false);
        this._name.set(windowTitle);
        this._availableAnimations.set([]);
        this._x.set(0);
        this._y.set(0);
        this._z.set(0);
        this._happiness.set(0);
        this._energy.set(0);
        this._hunger.set(255);
        this._thirst.set(255);
        this._nausea.set(0);
        this._toilet.set(0);
        this._mass.set(0);
        this._isStaff.set(false);
        this._isGuest.set(false);
        this._colour.set(100);
        this._animation.set("walking");
        this._animationLength.set(1);
        this._isHandyman.set(false);
        this._isMechanic.set(false);
        this._isSecurity.set(false);
        this._isEntertainer.set(false);
        this._orders.set(0);
        this._item.set("balloon");
        this._rideId.set(0);
        this._voucher.set(<Voucher>{type: "voucher", voucherType: "entry_free"});
        this._voucherType.set("entry_free");
        this._voucherItem.set("balloon");
        this._allGuestsSelected.set(false);
        this._allGuests.set([]);
        this._costume.set(<StaffCostume>"none");
    }

    _dispose(): void
    {
        if (this._onGameTick)
        {
            this._onGameTick.dispose();
        }
        this._onGameTick = undefined;
    }

    _select(peep: Guest | Staff): void
    {
        let pickedGuest: Entity[] = [];
        pickedGuest[0] = peep
        this._allGuests.set(pickedGuest);
        this._selectedPeep.set(<Guest|Staff>pickedGuest[0]);
        this._name.set(peep.name);
        this._animation.set(peep.animation);
        this._availableAnimations.set(peep.availableAnimations);
        this._conversionCheck(peep);
    }

    _selectAllGuests(pressed: boolean): void
    {
        if (pressed) {
            this._allGuests.set(map.getAllEntities("guest"));
            const firstGuest = <Guest>this._allGuests.get()[0]
            this._isPicking.set(false);
            this._name.set(`{GREEN}All guests selected`);
            this._availableAnimations.set(firstGuest.availableAnimations);
            this._animationLength.set(firstGuest.animationLength);
            ui.tool?.cancel();
        }
        else {
            this._allGuests.set([]);
            this._name.set(windowTitle);
            this._availableAnimations.set([]);
            this._animationLength.set(0);
        };
        this._x.set(0);
        this._y.set(0);
        this._z.set(0);
        this._isGuest.set(false);
        this._isStaff.set(false);
        this._selectedPeep.set(undefined);
        this._allGuestsSelected.set(pressed);
        this._tshirtColour.set(19);
        this._trousersColour.set(19);
        this._hatColour.set(19);
        this._balloonColour.set(19);
        this._umbrellaColour.set(19);
        this._happiness.set(0);
        this._energy.set(0);
        this._hunger.set(255);
        this._thirst.set(255);
        this._nausea.set(0);
        this._toilet.set(0);
        this._mass.set(0);
    }
    
    _locate(): void
    {
        const peep = this._selectedPeep.get();
        if (peep !== undefined) {
            ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
        }
    }

    _rename(): void
    {
        const peep = this._selectedPeep.get();
        if (peep !== undefined){
            ui.showTextInput({
                title: textInputTitle(peep),
                description: peepTypeQuery(peep),
                initialValue: `${peep.name}`,
                callback: text => {
                    this._name.set(text);
                    context.executeAction("pe-namepeep", namePeepExecuteArgs(peep.id, text));
                },
            });
        }
    }

    _setMotion(motion: PeepMotion): void
    {
        switch(motion) {
            case "frozen": this._isStatic.set(true); this._isFrozen.set(true); break;
            case "static": this._isStatic.set(true); this._isFrozen.set(false); break;
            case "moving": this._isStatic.set(false); this._isFrozen.set(false); break;
        }
        if (this._allGuestsSelected) {
            const guests = this._allGuests.get();
            guests.forEach(guest => {
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, this._isStatic.get(), "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, this._isFrozen.get(), "animationFrozen"));
            })
        }
        else {
            const peep = this._selectedPeep.get();
            if (peep !== undefined) {
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, this._isStatic.get(), "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, this._isFrozen.get(), "animationFrozen"));
            }
        }
    }

    _conversionCheck(peep: Entity): void
    {
        if (peep.type === "staff") {
            const staff = <Staff>peep;
            this._availableCostumes.set(staff.availableCostumes);
            if (staff.energy === 0) {
                context.executeAction("pe-peepspeed", peepSpeedExecuteArgs(staff.id, 96));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "animationFrozen"));
                debug("Old freezing method converted to new method");
            }
        }
    }

    _onGameTickExecuted(): void {
        const peep = this._selectedPeep.get();
        const staff = <Staff>peep;
        const guest = <Guest>peep;
        let hasItemArray: boolean[] = [];
        if (peep !== undefined)
        {
			if (peep.peepType !== "guest" && peep.peepType !== "staff") {
				ui.showError("Peep no longer", "available");
				this._reset();
			}
			else{
				hasItemArray = [];
				this._animation.set(peep.animation);
				this._animationFrame.set(peep.animationOffset);
				this._animationLength.set(peep.animationLength);
				if (peep.peepType === "guest")
				guestItemTypeList.forEach(item => {
					hasItemArray.push(guest.hasItem({type: item}));
				});
				this._hasItem.set(hasItemArray);
			}
            this._x.set(peep.x);
            this._y.set(peep.y);
            this._z.set(peep.z);
            this._energy.set(peep.energy);
            this._availableAnimations.set(peep.availableAnimations);
            peep.getFlag("animationFrozen") ? this._isFrozen.set(true) : this._isFrozen.set(false);
            peep.getFlag("positionFrozen") ? this._isStatic.set(true) : this._isStatic.set(false);
            if (peep.peepType === "staff"){
                this._isStaff.set(true); this._isGuest.set(false);
                this._colour.set(staff.colour);
                this._staffType.set(staff.staffType);
                staff.staffType === "handyman"? this._isHandyman.set(true) : this._isHandyman.set(false);
                staff.staffType === "mechanic"? this._isMechanic.set(true) : this._isMechanic.set(false);
                staff.staffType === "security"? this._isSecurity.set(true) : this._isSecurity.set(false);
                staff.staffType === "entertainer"? this._isEntertainer.set(true) : this._isEntertainer.set(false);
                this._availableCostumes.set(staff.availableCostumes);
                this._costume.set(<StaffCostume>staff.costume);
                this._availableStaffAnimations.set(staff.availableAnimations);
                this._orders.set(staff.orders);
            }
            if (peep.peepType === "guest")
                {
                this._isGuest.set(true); this._isStaff.set(false);
                this._tshirtColour.set(guest.tshirtColour);
                this._trousersColour.set(guest.trousersColour);
                this._hatColour.set(guest.hatColour);
                this._balloonColour.set(guest.balloonColour);
                this._umbrellaColour.set(guest.umbrellaColour);
                this._availableGuestAnimations.set(guest.availableAnimations);
                this._happiness.set(guest.happiness);
                this._hunger.set(guest.hunger);
                this._thirst.set(guest.thirst);
                this._nausea.set(guest.nausea);
                this._toilet.set(guest.toilet);
                this._mass.set(guest.mass);
                this._items.set(guest.items);
                guest.hasItem({ type: "hat" }) ? this._hasHat.set(true) : this._hasHat.set(false);
                guest.hasItem({ type: "balloon" }) ? this._hasBalloon.set(true) : this._hasBalloon.set(false);
                guest.hasItem({ type: "umbrella" }) ? this._hasUmbrella.set(true) : this._hasUmbrella.set(false);
                if (guest.hasItem({ type: "photo1" })) {
                    guest.items.forEach((item, index) => {
                        if (item.type === "photo1"){
                            const photo = <GuestPhoto>guest.items[index];
                            this._photo1RideName.set(map.getRide(photo.rideId).name);
                        }
                    });
                }
            }
        }
    }
}

function peepTypeQuery(peep: Guest | Staff | undefined): string {
	if (peep !== undefined && peep.type === "guest") {
		return "Enter name for this guest:";
	}
	else if (peep !== undefined && peep.type === "staff") {
		return "Enter name for this member of staff:";
	}
	else return "";
}

function textInputTitle(peep: Guest | Staff): string {
	if (peep.type === "guest") {
		return `{WHITE}Guest's name`;
	}
	else if (peep.type === "staff") {
		return `{WHITE}Staff member name`;
	}
	else return "";
}
    

export const model = new peepViewModel;