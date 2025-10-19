import { Bindable, Colour, compute, ElementVisibility, store, WritableStore } from "openrct2-flexui";
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
import { getColour, Theme } from "../helpers/settings";
import { staffType } from "../helpers/staffTypes";

type PeepMotion = "frozen" | "static" | "moving";

const windowTitle = "Peep Editor";
const defaultColour = getColour("pe.side.secondary", Colour.LightBrown);

export class PeepViewModel
{
    readonly _allGuests = store<Guest[]|BaseStaff[]>([]);
    readonly _allGuestEntities = store<Guest[]>([])
    readonly _allStaffEntities = store<Staff[]>([]);
    readonly _allGuestsSorted = store<string[]>([]);
    readonly _allStaffSorted = store<string[]>([]);
    
    readonly _selectedPeep = store<Guest|BaseStaff|null>(null);
    readonly _selectedStaff = compute(this._selectedPeep, p => <BaseStaff>p);
    
    //general
    readonly _name = store<string>(windowTitle);
    readonly _energy = store<number>(0);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _availableAnimations = store<GuestAnimation[]|StaffAnimation[]>([]);
    readonly _animationIndex = store<number>(0);
    readonly _animation = store<GuestAnimation|StaffAnimation>("walking");
    readonly _animationFrame = store<number>(0);
    readonly _animationLength = store<number>(1);
    readonly _animationItems = compute(this._availableAnimations, a => a.map(animationList));
    
    //staff    
    readonly _staffTypeIndex = store<number>(0);
    readonly _staffType = compute(this._staffTypeIndex, i => staffType[i]);
    readonly _availableCostumes = compute(this._selectedStaff, s => s ? s.availableCostumes : []);
    readonly _availableCostumeStrings = compute(this._selectedStaff, s => s ? s.getCostumeStrings() : []);
    readonly _costumeIndex = store<number>(0);
    readonly _costume = compute(this._costumeIndex, i => this._availableCostumes.get()[i]);
    readonly _colour = compute(this._selectedStaff, s => s?.colour || 0);
    readonly _orders = store<number>(0);
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);
    readonly _securityOrders = store<boolean>(true);
    readonly _entertainerOrders = store<boolean>(true);

    //guest
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
    readonly _items = store<GuestItem[]>([]);
    readonly _rideId = store<number>(0);
    readonly _item = store<GuestItemType>("balloon");
    readonly _photo1RideName = store<string>("");
    readonly _photo2RideName = store<string>("");
    readonly _photo3RideName = store<string>("");
    readonly _photo4RideName = store<string>("");
    readonly _photo1 = store<GuestPhoto>({type: "photo1", rideId: this._rideId.get()});
    readonly _photo2 = store<GuestPhoto>({type: "photo2", rideId: this._rideId.get()});
    readonly _photo3 = store<GuestPhoto>({type: "photo3", rideId: this._rideId.get()});
    readonly _photo4 = store<GuestPhoto>({type: "photo4", rideId: this._rideId.get()});
    readonly _voucher = store<Voucher>({type: "voucher", voucherType: "entry_free"});
    readonly _voucherItem = store<GuestItemType|null>(null);
    readonly _voucherType = store<VoucherType|null>(null);
    readonly _availableGuestAnimations = store<GuestAnimation[]>([]);

    //window
    readonly _mainWindow = store<Window|null>(null);
    readonly _sideWindow = store<Window|null>(null);
    readonly _theme = store<Theme>(context.sharedStorage.get("pe.theme", "rct1"));
    readonly _stickySideWindow = store<boolean>(context.sharedStorage.get("pe.sticky", true));
    readonly _pinToTop = store<boolean>(context.sharedStorage.get("pe.favourite", false));
    readonly _peepSelection = store<EntityType>("guest");
    readonly _multiplierIndex = store<number>(0);
	readonly _multiplier = compute(this._multiplierIndex, idx => (10 ** idx));
    readonly _mainWindowColour =
    {
        primary: store<Colour>(getColour("pe.main.primary", Colour.DarkYellow)),
        secondary: store<Colour>(getColour("pe.main.secondary", Colour.DarkYellow)),
        tertiary: store<Colour>(Colour.DarkYellow),
    };
    readonly _sideWindowColour =
    {
        primary: store<Colour>(getColour("pe.side.primary", Colour.DarkYellow)),
        secondary: store<Colour>(getColour("pe.side.secondary", Colour.DarkYellow)),
        tertiary: store<Colour>(Colour.DarkYellow),
    };

    //custom
    readonly _isGuest = compute(this._selectedPeep, peep => (peep?.peepType === "guest" || false));
    readonly _isHandyman = compute(this._staffType, t => t === "handyman");
    readonly _isMechanic = compute(this._staffType, t => t === "mechanic");
    readonly _isSecurity = compute(this._staffType, t => t === "security");
    readonly _isEntertainer = compute(this._staffType, t => t === "entertainer");
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = store<boolean>(false);
    readonly _isStatic = store<boolean>(false);
    readonly _isPeepSelected = compute(this._selectedPeep, peep => (peep !== null));
    readonly _allGuestsSelected = store<boolean>(false);

    readonly _rideList = store<ParkRide[]>([]);
    readonly _selectedRide = store<[ParkRide, number] | null>(null);

    readonly _isPositionDisabled = compute(this._isFrozen, this._isStatic, (f, s) => !f && !s);
    readonly _visibleWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a ? "visible" : "none");
    readonly _visibleRideDropdown = compute(this._item, this._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none")
    readonly _disabledWhenNoSinglePeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p || a);
    readonly _disabledWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a);
    readonly _visibilityListviewWhenGuest = compute(this._peepSelection, p => p === "guest" ? "visible" : "none");
    readonly _visibilityListviewWhenStaff = compute(this._peepSelection, p => p === "staff" ? "visible" : "none");
    

    private _onGameTick?: IDisposable;

    constructor()
    {
        this._selectedPeep.subscribe(peep =>
        {
            if (peep === null) return;
            this._updatePeepInfo(peep);
            if (peep.peepType === "guest")
            {
                this._updateGuestInfo(<Guest>peep);
            }
            else this._updateStaffInfo(<BaseStaff>peep);
        })
    }

    _open(): void
    {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted());
        this._conversionCheck();
    }

    _close(): void
    {
        this._allGuests.set([]);
        this._selectedPeep.set(null);
        this._name.set(windowTitle);
        this._allGuestsSelected.set(false);
        this._multiplierIndex.set(0);
    }

    _dispose(): void
    {
        if (this._onGameTick)
        {
            this._onGameTick.dispose();
        }
        this._onGameTick = undefined;
    }

    _select(peep: Guest | BaseStaff): void
    {
        let array: Guest[] = []
        this._selectedPeep.set(peep);
        array[0] = <Guest>peep;
        this._allGuests.set(array);
    }
    
    _getAllGuests(): void
    {
        this._allGuests.set(map.getAllEntities("guest"));
        this._availableAnimations.set(this._allGuests.get()[0].availableAnimations);
        this._animationLength.set(this._allGuests.get()[0].animationLength);
    }

    _toggleAllGuests(pressed: boolean): void
    {
        if (pressed) {
            this._getAllGuests();
            this._isPicking.set(false);
            this._selectedPeep.set(null);
            this._name.set(`{GREEN}All guests selected`);
            ui.tool?.cancel();
        }
        else {
            this._allGuests.set([]);
            this._name.set(windowTitle);
        }
        this._allGuestsSelected.set(pressed);
        this._tshirtColour.set(defaultColour);
        this._trousersColour.set(defaultColour);
        this._hatColour.set(defaultColour);
        this._balloonColour.set(defaultColour);
        this._umbrellaColour.set(defaultColour);
    }
    
    _locate(peep: Guest|BaseStaff|null): void
    {
        if (peep !== null) ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
    }

    _rename(peep: Guest|BaseStaff|null): void
    {
        if (peep !== null)
        {
            ui.showTextInput({
                title: textInputTitle(peep),
                description: peepTypeQuery(peep),
                initialValue: `${peep.name}`,
                callback: text => {context.executeAction("pe-namepeep", namePeepExecuteArgs(peep.id, text)); this._name.set(text)}
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
        if (this._allGuestsSelected.get()) this._getAllGuests();
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

    _conversionCheck(): void
    {
        const allStaff = map.getAllEntities("staff");
        allStaff.forEach(staff =>
        {
            this._availableCostumes.set(staff.availableCostumes);
            if (staff.energy === 0)
            {
                context.executeAction("pe-guestkeys", guestKeysExecuteArgs(staff.id, 96, "energy"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "animationFrozen"));
                debug("Old freezing method converted to new method");
            }
        });
    }

    _isVisibleWhen(check: WritableStore<boolean>, inverted?: "inverted"): Bindable<ElementVisibility>
    {
        if (inverted !== undefined) return compute(check, c => c ? "none" : "visible");
        else return compute(check, c => c ? "visible" : "none");
    }

    private _updatePeepInfo(peep: Guest | BaseStaff): void
    {
        this._name.set(peep.name);
        this._animation.set(peep.animation);
        this._animationLength.set(peep.animationLength);
        peep.getFlag("animationFrozen") ? this._isFrozen.set(true) : this._isFrozen.set(false);
        peep.getFlag("positionFrozen") ? this._isStatic.set(true) : this._isStatic.set(false);
        this._updateDynamicDataFromPeep(peep);
    }

    private _updateGuestInfo(guest: Guest): void
    {
        this._tshirtColour.set(guest.tshirtColour);
        this._trousersColour.set(guest.trousersColour);
        this._hatColour.set(guest.hatColour);
        this._balloonColour.set(guest.balloonColour);
        this._umbrellaColour.set(guest.umbrellaColour);
        this._availableGuestAnimations.set(guest.availableAnimations);
        this._getPhotoRideName();
    }

    private _updateStaffInfo(staff: BaseStaff): void
    {
        this._colour.set(staff.colour);
        this._orders.set(staff.orders);
        this._staffType.set(staff.staffType);
        this._staffTypeIndex.set(staffType.indexOf(staff.staffType));
        this._items.set([]);
        this._isHandyman.set(staff.staffType === "handyman");
        this._isMechanic.set(staff.staffType === "mechanic");
        this._isSecurity.set(staff.staffType === "security");
        this._isEntertainer.set(staff.staffType === "entertainer");
        this._costumeIndex.set(this._availableCostumes.get().indexOf(<StaffCostume>staff.costume));
    }

    private _updateDynamicDataFromPeep(peep: Guest | BaseStaff): void
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
        else
        {
        const staff = <BaseStaff>peep;
        this._availableCostumeStrings.set(staff.getCostumeStrings());
        this._availableCostumes.set(staff.availableCostumes);
        this._availableStaffAnimations.set(staff.availableAnimations);
        }
        this._x.set(peep.x);
        this._y.set(peep.y);
        this._z.set(peep.z);
        this._energy.set(peep.energy);
        this._availableAnimations.set(peep.availableAnimations);
        this._animationFrame.set(peep.animationOffset);
        
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
        const guest = <Guest>model._selectedPeep.get();
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

    _peepsAlphabetized(allPeeps: (Guest | BaseStaff)[]): string[]
    {
        const arr: (Guest | BaseStaff)[] = [];
        allPeeps.forEach(peep =>
        {
            if (peep.getFlag("positionFrozen") || peep.getFlag("animationFrozen"))
            {
                arr.push(peep);
            }
            return arr;
        });
        return arr.map(peep => peep.name).sort()
    }
}

function peepTypeQuery(peep: Guest | BaseStaff | undefined): string {
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

function textInputTitle(peep: Guest | BaseStaff): string {
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