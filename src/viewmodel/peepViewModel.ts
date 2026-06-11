import { Colour, compute, store, WritableStore } from "openrct2-flexui";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { debug } from "../helpers/logger";
import { GuestKey, guestKeysExecuteArgs } from "../actions/guestKeys";
import { getWindow } from "../helpers/getWindow";
import { GuestColours } from "../helpers/colours";
import { colourPeepExecuteArgs } from "../actions/peepColour";
import { animationList } from "../helpers/animations";
import { staffOrdersExecuteArgs } from "../actions/staffSetOrders";
import { getColour } from "../helpers/settings";
import { staffType } from "../helpers/staffTypes";
import { multiplier, multiplierIndex, windowTitle } from "../ui/windowConsts";
import { photo1RideName, photo2RideName, photo3RideName, photo4RideName } from "../helpers/rides";

type PeepMotion = "frozen" | "static" | "moving";

const defaultColour = getColour("pe.side.secondary", Colour.LightBrown);

export class PeepViewModel
{
    readonly _allGuests = store<Guest[]|BaseStaff[]>([]);
    readonly _allGuestEntities = store<Guest[]>([])
    readonly _allStaffEntities = store<BaseStaff[]>([]);
    readonly _allGuestsSorted = store<string[]>([]);
    readonly _allStaffSorted = store<string[]>([]);
    
    readonly _selectedPeep = store<Guest|BaseStaff|null>(null);
    
    //general
    readonly _name = this._computePeepProperty<Guest|BaseStaff, string>(peep => peep.name, windowTitle);
    readonly _energy = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.energy, 0);
    readonly _x = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.x, 0);
    readonly _y = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.y, 0);
    readonly _z = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.z, 0);
    readonly _availableAnimations = this._computePeepProperty<Guest|BaseStaff, GuestAnimation[]|StaffAnimation[]>(peep => peep.availableAnimations, []);
    readonly _animationIndex = store<number>(0);
    readonly _animation = this._computePeepProperty<Guest|BaseStaff, GuestAnimation|StaffAnimation>(peep => peep.animation, "walking");
    readonly _animationFrame = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.animationOffset, 0);
    readonly _animationLength = this._computePeepProperty<Guest|BaseStaff, number>(peep => peep.animationLength, 0);
    readonly _animationItems = compute(this._availableAnimations, a => a.map(animationList));
    
    //staff
    readonly _staffTypeIndex = this._computePeepProperty<BaseStaff, number>(staff  => staffType.indexOf(staff.staffType), 0, "staff");
    readonly _staffType = this._computePeepProperty<BaseStaff, StaffType | undefined>(staff => staff.staffType, undefined, "staff");
    readonly _availableCostumes = this._computePeepProperty<BaseStaff, StaffCostume[]>(staff => staff.availableCostumes, [], "staff");
    readonly _availableCostumeStrings = this._computePeepProperty<BaseStaff, string[]>(staff => staff.getCostumeStrings(), [], "staff");
    readonly _costumeIndex = this._computePeepProperty<BaseStaff, number>(staff => this._availableCostumes.get().indexOf(<StaffCostume>staff.costume), 0, "staff");
    readonly _costume = compute(this._costumeIndex, i => this._availableCostumes.get()[i]);
    readonly _colour = this._computePeepProperty<BaseStaff, number>(staff => staff.colour, 0, "staff");
    readonly _orders = this._computePeepProperty<BaseStaff, number>(staff => staff.orders, 0, "staff");
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);
    readonly _securityOrders = store<boolean>(true);
    readonly _entertainerOrders = store<boolean>(true);

    //guest
    readonly _tshirtColour = this._computePeepProperty<Guest, number>(guest  => guest.tshirtColour, defaultColour, "guest");
    readonly _trousersColour = this._computePeepProperty<Guest, number>(guest  => guest.trousersColour, defaultColour, "guest");
    readonly _balloonColour = this._computePeepProperty<Guest, number>(guest  => guest.balloonColour, defaultColour, "guest");
    readonly _hatColour = this._computePeepProperty<Guest, number>(guest  => guest.hatColour, defaultColour, "guest");
    readonly _umbrellaColour = this._computePeepProperty<Guest, number>(guest  => guest.umbrellaColour, defaultColour, "guest");
    readonly _happiness = this._computePeepProperty<Guest, number>(guest  => guest.happiness, 0, "guest");
    readonly _nausea = this._computePeepProperty<Guest, number>(guest  => guest.nausea, 0, "guest");
    readonly _hunger = this._computePeepProperty<Guest, number>(guest  => guest.hunger, 255, "guest");
    readonly _thirst = this._computePeepProperty<Guest, number>(guest  => guest.thirst, 255, "guest");
    readonly _toilet = this._computePeepProperty<Guest, number>(guest  => guest.toilet, 0, "guest");
    readonly _mass = this._computePeepProperty<Guest, number>(guest  => guest.mass, 0, "guest");
    readonly _items = this._computePeepProperty<Guest, GuestItem[]>(guest  => guest.items, [], "guest");
    readonly _item = store<GuestItemType>("balloon");
    readonly _voucher = store<Voucher>({type: "voucher", voucherType: "entry_free"});
    readonly _voucherItem = store<GuestItemType|null>(null);
    readonly _voucherType = store<VoucherType|null>(null);
    readonly _availableGuestAnimations = this._computePeepProperty<Guest, GuestAnimation[]>(guest  => guest.availableAnimations, [], "guest");

    //window
    readonly _selectPeepType = store<EntityType>("guest");

    //custom
    readonly _isGuest = compute(this._selectedPeep, peep => (peep?.peepType === "guest"));
    readonly _isHandyman = compute(this._selectedPeep, this._staffType, (p, t) => (p as BaseStaff) && t === "handyman");
    readonly _isMechanic = compute(this._selectedPeep, this._staffType, (p, t) => (p as BaseStaff) && t === "mechanic");
    readonly _isSecurity = compute(this._selectedPeep, this._staffType, (p, t) => (p as BaseStaff) && t === "security");
    readonly _isEntertainer = compute(this._selectedPeep, this._staffType, (p, t) => (p as BaseStaff) && t === "entertainer");
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = store<boolean>(false);
    readonly _isStatic = store<boolean>(false);
    readonly _isPeepSelected = compute(this._selectedPeep, peep => (peep !== null));
    readonly _allGuestsSelected = store<boolean>(false);


    readonly _isPositionDisabled = compute(this._isFrozen, this._isStatic, (f, s) => !f && !s);
    readonly _visibleWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a ? "visible" : "none");
    readonly _visibleRideDropdown = compute(this._item, this._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none")
    readonly _disabledWhenNoSinglePeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p || a);
    readonly _disabledWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuestsSelected, (p, a) => !p && !a);
    readonly _visibilityListviewWhenGuest = compute(this._selectPeepType, p => p === "guest" ? "visible" : "none");
    readonly _visibilityListviewWhenStaff = compute(this._selectPeepType, p => p === "staff" ? "visible" : "none");
    

    private _onGameTick?: IDisposable;

    constructor()
    {
        this._selectedPeep.subscribe(peep => this._updateDynamicDataFromPeep(peep));
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
        this._allGuestsSelected.set(false);
        multiplierIndex.set(0);
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
        if (peep) context.executeAction("pe-guestkeys", guestKeysExecuteArgs(peep.id, (adjustment * multiplier.get()), key));
    }

    _isVisibleWhen = (check: WritableStore<boolean>, visibleOnTrue: boolean = true) => compute(check, c => (c === visibleOnTrue) ? "visible" : "none");

    private _conversionCheck(): void
    {
        const allStaff = map.getAllEntities("staff");
        allStaff.forEach(staff =>
        {
            if (staff.energy === 0)
            {
                context.executeAction("pe-guestkeys", guestKeysExecuteArgs(staff.id, 96, "energy"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "positionFrozen"));
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(staff.id, true, "animationFrozen"));
                debug("Old freezing method converted to new method");
            }
        });
    }

    private _computePeepProperty<P, T>(extractor: (peep: P) => T, fallback: T, expectedType?: string): WritableStore<T>
    {
        return compute(this._selectedPeep, p =>
        {
            const isValid = p && (!expectedType || (p as any).peepType === expectedType);
            return isValid ? extractor(p as unknown as P) : fallback;
        });
    }

    private _updateDynamicDataFromPeep(peep: Guest | BaseStaff | null): void
    {
        if (peep ===null) return;
        if (peep.peepType !== "guest" && peep.peepType !== "staff") {
            this._close();
            getWindow("Properties")?.close();
            ui.showError("Peep no longer", "available");
            return;
        }

        peep.getFlag("animationFrozen") ? this._isFrozen.set(true) : this._isFrozen.set(false);
        peep.getFlag("positionFrozen") ? this._isStatic.set(true) : this._isStatic.set(false);

        const { x, y, z, energy, availableAnimations, animationOffset } = peep;

        this._x.set(x);
        this._y.set(y);
        this._z.set(z);
        this._energy.set(energy);
        this._availableAnimations.set(availableAnimations);
        this._animationFrame.set(animationOffset);

        if (peep.peepType === "guest") {
            const { happiness, hunger, thirst, nausea, toilet, mass, items } = peep as Guest;

            this._happiness.set(happiness);
            this._hunger.set(hunger);
            this._thirst.set(thirst);
            this._nausea.set(nausea);
            this._toilet.set(toilet);
            this._mass.set(mass);
            this._items.set(items);
            this._getPhotoRideName(peep as Guest);
        }
        else {
            const staff = peep as BaseStaff;
            this._availableCostumeStrings.set(staff.getCostumeStrings());
            this._availableStaffAnimations.set(staff.availableAnimations);
        }
    }

    private _onGameTickExecuted(): void
    {
        const peep = this._selectedPeep.get();
        if (peep)
        {
            this._updateDynamicDataFromPeep(peep);
        }
    }

    private _getPhotoRideName(guest: Guest): void
    {
        if (guest.hasItem({ type: "photo1" }) || guest.hasItem({ type: "photo2" }) ||guest.hasItem({ type: "photo3" }) || guest.hasItem({ type: "photo4" }))
        {
            guest.items.forEach((item, index) =>
            {
                const photo = <GuestPhoto>guest.items[index];
                switch (item.type)
                {
                    case "photo1": { photo1RideName.set(map.getRide(photo.rideId).name); break; }
                    case "photo2": { photo2RideName.set(map.getRide(photo.rideId).name); break; }
                    case "photo3": { photo3RideName.set(map.getRide(photo.rideId).name); break; }
                    case "photo4": { photo4RideName.set(map.getRide(photo.rideId).name); break; }
                }
            });
        }
    }
}
    
export const model = new PeepViewModel;