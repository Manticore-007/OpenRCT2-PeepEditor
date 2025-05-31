import { Colour, compute, store, WritableStore } from "openrct2-flexui";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { namePeepExecuteArgs } from "../actions/peepNamer";
import { debug } from "../helpers/logger";
import { ParkRide } from "../objects/parkRides";
import { GuestKey, guestKeysExecuteArgs } from "../actions/guestKeys";
import { getWindow } from "../helpers/getWindow";
import { GuestColours } from "../helpers/colours";
import { colourPeepExecuteArgs } from "../actions/peepColour";
import { animationList } from "../helpers/animations";
import { staffOrdersExecuteArgs } from "../actions/staffSetOrders";
import { getColour } from "../helpers/settings";

type PeepMotion = "frozen" | "static" | "moving";

const windowTitle = "Peep Editor";
const defaultColour = getColour("pe.side.secondary", Colour.LightBrown);

export class PeepViewModel
{
    //general

    readonly _allGuests = store<Guest[]|Staff[]>([]);
    readonly _selectedPeep = compute(this._allGuests, a => a[0]);
    readonly _name = store<string>(windowTitle);
    readonly _energy = store<number>(0);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _availableAnimations = store<GuestAnimation[]|StaffAnimation[]>([]);
    readonly _animationFrame = store<number>(0);
    readonly _animationLength = store<number>(1);
    readonly _animation = store<GuestAnimation|StaffAnimation>();


    //staff
    
    readonly _selectedStaff = compute(this._selectedPeep, p => <Staff>p);
    readonly _staffType = store<StaffType>("handyman");
    readonly _colour = store<number>(100);
    readonly _availableCostumes = store<StaffCostume[]>([]);
    readonly _costume = store<StaffCostume>("none");
    readonly _orders = store<number>(0);
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);


    //guest

    readonly _selectedGuest = compute(this._selectedPeep, p => <Guest>p);
    readonly _tshirtColour = store<number>(defaultColour);
    readonly _trousersColour = store<number>(defaultColour);
    readonly _balloonColour = store<number>(defaultColour);
    readonly _hatColour = store<number>(defaultColour);
    readonly _umbrellaColour = store<number>(defaultColour);
    readonly _happiness = store<number>(0);
    readonly _nausea = store<number>(0);
    readonly _hunger = store<number>(255);
    readonly _thirst = store<number>(255);
    readonly _toilet = store<number>(0);
    readonly _mass = store<number>(0);
    readonly _items = store<GuestItem[]>([{type: "balloon"}]);
    readonly _hasItem = store<boolean[]>([]);
    readonly _availableGuestAnimations = store<GuestAnimation[]>([]);
    readonly _rideId = store<number>(0);
    readonly _photo1RideName = store<string>("");
    readonly _photo2RideName = store<string>("");
    readonly _photo3RideName = store<string>("");
    readonly _photo4RideName = store<string>("");
    readonly _photo1 = store<GuestPhoto>({type: "photo1", rideId: this._rideId.get()})
    readonly _photo2 = store<GuestPhoto>({type: "photo2", rideId: this._rideId.get()})
    readonly _photo3 = store<GuestPhoto>({type: "photo3", rideId: this._rideId.get()})
    readonly _photo4 = store<GuestPhoto>({type: "photo4", rideId: this._rideId.get()})
    readonly _item = store<GuestItemType>("balloon");
    readonly _voucher = store<Voucher>(<Voucher>{type: "voucher", voucherType: "entry_free"});
    readonly _voucherItem = store<GuestItemType>("balloon");
    readonly _voucherType = store<VoucherType>("entry_free");


    //custom

    readonly _isGuest = store<boolean>(false);
    readonly _isHandyman = store<boolean>(false);
    readonly _isMechanic = store<boolean>(false);
    readonly _isSecurity = store<boolean>(false);
    readonly _isEntertainer = store<boolean>(false);
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = store<boolean>(false);
    readonly _isStatic = store<boolean>(false);
    readonly _isPeepSelected = compute(this._selectedPeep, p => p ? true : false);
    readonly _allGuestsSelected = store<boolean>(false);
    readonly _rideList = store<ParkRide[]>([]);
    readonly _selectedRide = store<[ParkRide, number] | null>(null);
    readonly _isPositionDisabled = compute(this._isFrozen, this._isStatic, (f, s) => !f && !s);
    readonly _visibleWhenStaff = compute(this._isGuest, this._allGuestsSelected, (g, a) => !g && !a ? "visible" : "none");
    readonly _visibleWhenSingleGuest = compute(this._isGuest, g => g ? "visible" : "none");
    readonly _visibleWhenNotStaff = compute(this._isGuest, this._allGuestsSelected, (g, a) => g || a ? "visible" : "none");
    readonly _visibleWhenHandyman = compute(this._isHandyman, this._isGuest, (h, g) => h && !g ? "visible" : "none");
    readonly _visibleWhenMechanic = compute(this._isMechanic, this._isGuest, (m, g) => m && !g ? "visible" : "none");
    readonly _visibleWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a ? "visible" : "none");
    readonly _visibleRideDropdown = compute(this._item, this._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none")
    readonly _disabledWhenNoSinglePeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p || a);
    readonly _disabledWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a);
    readonly _animationItems = compute(this._availableAnimations, a => a.map(animationList));
    readonly _multiplierIndex = store<number>(0);
	readonly _multiplier = compute(this._multiplierIndex, idx => (10 ** idx));
    

    private _onGameTick?: IDisposable;

    constructor()
    {
        this._selectedPeep.subscribe(peep =>
        {
            if (peep)
            {
                this._updatePeepInfo(peep);
                if (peep.peepType === "guest")
                {
                    this._updateGuestInfo(<Guest>peep);
                }
                else this._updateStaffInfo(<Staff>peep);
            }
        })
    }

    _open(): void
    {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted());
    }

    _close(): void
    {
        this._allGuests.set([]);
        this._name.set(windowTitle);
        this._allGuestsSelected.set(false);
        this._multiplierIndex.set(0);
        this._dispose();
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
        const pickedGuest: Guest[] | Staff[] = [];
        pickedGuest[0] = peep;
        this._allGuests.set(pickedGuest);
        this._animation.set(peep.animation);
        this._availableAnimations.set(peep.availableAnimations);
        this._conversionCheck(peep);
    }
    
    _getAllGuests(): void
    {
        this._allGuests.set(map.getAllEntities("guest"));
        this._availableAnimations.set(this._selectedGuest.get().availableAnimations);
        this._animationLength.set(this._selectedGuest.get().animationLength);
    }

    _toggleAllGuests(pressed: boolean): void
    {
        if (pressed) {
            this._getAllGuests();
            this._isPicking.set(false);
            this._name.set(`{GREEN}All guests selected`);
            ui.tool?.cancel();
        }
        else {
            this._allGuests.set([]);
            this._name.set(windowTitle);
        }
        this._isGuest.set(false);
        this._allGuestsSelected.set(pressed);
        this._tshirtColour.set(defaultColour);
        this._trousersColour.set(defaultColour);
        this._hatColour.set(defaultColour);
        this._balloonColour.set(defaultColour);
        this._umbrellaColour.set(defaultColour);
    }
    
    _locate(): void
    {
        const peep = this._selectedPeep.get();
        if (peep)
        {
            ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
        }
    }

    _rename(): void
    {
        const peep = this._selectedPeep.get();
        if (peep)
        {
            ui.showTextInput({
                title: textInputTitle(peep),
                description: peepTypeQuery(peep),
                initialValue: `${peep.name}`,
                callback: text => context.executeAction("pe-namepeep", namePeepExecuteArgs(peep.id, text))
            });
        }
    }

    _setMotion(motion: PeepMotion): void
    {
        switch(motion)
        {
            case "frozen": this._isStatic.set(true); this._isFrozen.set(true); break;
            case "static": this._isStatic.set(true); this._isFrozen.set(false); break;
            case "moving": this._isStatic.set(false); this._isFrozen.set(false); break;
        }
        if (this._allGuestsSelected.get())
        {
            this._getAllGuests();
        }
        model._allGuests.get().forEach(guest =>
        {
            context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, this._isStatic.get(), "positionFrozen"));
            context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, this._isFrozen.get(), "animationFrozen"));
        });
    }

    _setItemColour(colour: number, key: GuestColours): void
    {
        model._allGuests.get().forEach(guest => context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, key)));
    }

    _setStafforders(order: number): WritableStore<boolean>
    {
        return compute(model._orders, o => (o & order) !== 0)
    }

    _modifyStaffOrders(check: boolean, order: number): void
    {
        const peep = this._selectedPeep.get();
        if (peep) 
        {
            context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, check, order));
        }
    }

    _modifyGuestKey(adjustment: number, key: GuestKey): void
    {
        const peep = this._selectedPeep.get();
        if (peep) context.executeAction("pe-guestkeys", guestKeysExecuteArgs(peep.id, (adjustment * this._multiplier.get()), key));
    }

    _conversionCheck(peep: Entity): void
    {
        if (peep.type === "staff") {
            const staff = <Staff>peep;
            this._availableCostumes.set(staff.availableCostumes);
            if (staff.energy === 0) {
                context.executeAction("pe-guestkeys", guestKeysExecuteArgs(peep.id, 96, "energy"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "animationFrozen"));
                debug("Old freezing method converted to new method");
            }
        }
    }

    private _updatePeepInfo(peep: Guest | Staff): void
    {
        this._name.set(peep.name);
        this._availableAnimations.set(peep.availableAnimations);
        this._animation.set(peep.animation);
        this._animationFrame.set(peep.animationOffset);
        this._animationLength.set(peep.animationLength);
        peep.getFlag("animationFrozen") ? this._isFrozen.set(true) : this._isFrozen.set(false);
        peep.getFlag("positionFrozen") ? this._isStatic.set(true) : this._isStatic.set(false);
        this._updateDynamicDataFromPeep(peep);
    }

    private _updateGuestInfo(guest: Guest): void
    {
        if (guest) this._isGuest.set(true);
        this._tshirtColour.set(guest.tshirtColour);
        this._trousersColour.set(guest.trousersColour);
        this._hatColour.set(guest.hatColour);
        this._balloonColour.set(guest.balloonColour);
        this._umbrellaColour.set(guest.umbrellaColour);
        this._availableGuestAnimations.set(guest.availableAnimations);
        this._getPhotoRideName();
    }

    private _updateStaffInfo(staff: Staff): void
    {
        if (staff) this._isGuest.set(false);
        this._colour.set(staff.colour);
        this._costume.set(<StaffCostume>staff.costume);
        this._orders.set(staff.orders);
        this._staffType.set(staff.staffType);
        this._availableCostumes.set(staff.availableCostumes);
        this._availableStaffAnimations.set(staff.availableAnimations);
        staff.staffType === "handyman" ? this._isHandyman.set(true) : this._isHandyman.set(false);
        staff.staffType === "mechanic" ? this._isMechanic.set(true) : this._isMechanic.set(false);
        staff.staffType === "security" ? this._isSecurity.set(true) : this._isSecurity.set(false);
        staff.staffType === "entertainer" ? this._isEntertainer.set(true) : this._isEntertainer.set(false);
    }

    private _updateDynamicDataFromPeep(peep: Guest | Staff): void
    {
        if (peep.type === "guest")
        {
        const guest = <Guest>peep;
        this._happiness.set(guest.happiness);
        this._hunger.set(guest.hunger);
        this._thirst.set(guest.thirst);
        this._nausea.set(guest.nausea);
        this._toilet.set(guest.toilet);
        this._mass.set(guest.mass);
        this._items.set(guest.items);
        }
        this._x.set(peep.x);
        this._y.set(peep.y);
        this._z.set(peep.z);
        this._energy.set(peep.energy);
        
        if (peep.peepType !== "guest" && peep.peepType !== "staff")
        {
            ui.showError("Peep no longer", "available");
            this._close();
            getWindow("Properties")?.close();
        }
}

    _onGameTickExecuted(): void
    {
        const peep = this._selectedPeep.get();
        if (peep)
        {
            this._updateDynamicDataFromPeep(peep);
        }
    }

    _getPhotoRideName(): void
    {
        const guest = model._selectedGuest.get();
        if (guest.hasItem({ type: "photo1" }) || guest.hasItem({ type: "photo2" }) ||guest.hasItem({ type: "photo3" }) || guest.hasItem({ type: "photo4" }))
        {
            guest.items.forEach((item, index) =>
            {
                const photo = <GuestPhoto>guest.items[index];
                switch (item.type)
                {
                    case "photo1":
                    {
                        this._photo1RideName.set(map.getRide(photo.rideId).name);
                        break;
                    }
                    case "photo2":
                    {
                        this._photo2RideName.set(map.getRide(photo.rideId).name);
                        break;
                    }
                    case "photo3":
                    {
                        this._photo3RideName.set(map.getRide(photo.rideId).name);
                        break;
                    }
                    case "photo4":
                    {
                        this._photo4RideName.set(map.getRide(photo.rideId).name);
                        break;
                        }
                }
            });
        }
    }
}

function peepTypeQuery(peep: Guest | Staff | undefined): string {
	if (peep !== undefined && peep.type === "guest")
    {
		return "Enter name for this guest:";
	}
	else if (peep !== undefined && peep.type === "staff")
    {
		return "Enter name for this member of staff:";
	}
	else return "";
}

function textInputTitle(peep: Guest | Staff): string {
	if (peep.type === "guest")
    {
		return `{WHITE}Guest's name`;
	}
	else if (peep.type === "staff")
    {
		return `{WHITE}Staff member name`;
	}
	else return "";
}
    
export const model = new PeepViewModel;