import { Bindable, Colour, compute, ElementVisibility, Store, store, WritableStore } from "openrct2-flexui";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { debug } from "../helpers/logger";
import { GuestKey, guestKeysExecuteArgs } from "../actions/guestKeys";
import { getWindow } from "../helpers/getWindow";
import { GuestColours } from "../helpers/colours";
import { colourExecuteArgs } from "../actions/colour";
import { animationList } from "../helpers/animations";
import { ordersExecuteArgs } from "../actions/orders";
import { getColour } from "../helpers/settings";
import { staffType } from "../helpers/staffTypes";
import { multiplier, multiplierIndex, windowTitle } from "../ui/windowConsts";
import { photo1RideName, photo2RideName, photo3RideName, photo4RideName, rideId } from "../helpers/rides";
import { positionExecuteArgs } from "../actions/position";
import { directionExecuteArgs } from "../actions/direction";
import { staffTypeExecuteArgs } from "../actions/staffType";
import { costumeExecuteArgs } from "../actions/costume";
import { animationExecuteArgs } from "../actions/animation";
import { animationFrameExecuteArgs } from "../actions/animationFrame";
import { itemRemoveExecuteArgs } from "../actions/removeItem";
import { giveItemExecuteArgs } from "../actions/giveItem";

const peepDirections = ["NE", "SE", "SW", "NW"] as const;
export type PeepDirection = typeof peepDirections[number];
type PeepMotion = "frozen" | "static" | "moving";

const defaultColour = getColour("pe.side.secondary", Colour.LightBrown);

export class PeepViewModel {

    readonly _allGuests = store<Guest[] | BaseStaff[] | null[]>([]);
    readonly _allGuestEntities = store<Guest[]>([]);
    readonly _allStaffEntities = store<BaseStaff[]>([]);
    readonly _allGuestsSorted = store<string[]>([]);
    readonly _allStaffSorted = store<string[]>([]);
    readonly _selectedPeep = store<Guest | BaseStaff | null>(null);
    readonly _numGuests = store<number>(0);

    //general
    readonly _name = store<string>(windowTitle)
    readonly _energy = store<number>(0);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _availableAnimations = store<GuestAnimation[] | StaffAnimation[]>([]);
    readonly _animation = store<GuestAnimation | StaffAnimation>("walking");
    readonly _animationFrame = store<number>(0);
    readonly _animationLength = store<number>(0);
    readonly _animationItems = compute(this._availableAnimations, a => a.map(animationList));
    readonly _animationIndex = this._computePeepProperty<Guest | BaseStaff, number>(peep => peep.availableAnimations.indexOf(peep.animation as any), 0)

    //staff
    readonly _staffTypeIndex = this._computePeepProperty<BaseStaff, number>(staff => staffType.indexOf(staff.staffType), 0, "staff");
    readonly _staffType = store<StaffType | null>(null)
    readonly _availableCostumes = store<StaffCostume[]>([])
    readonly _availableCostumeStrings = store<string[]>([])
    readonly _costumeIndex = store<number>(0);
    readonly _costume = store<StaffCostume | null>(null);
    readonly _colour = store<Colour>(defaultColour);
    readonly _orders = store<number>(0);
    readonly _availableStaffAnimations = store<StaffAnimation[]>([]);
    readonly _securityOrders = store<boolean>(true);
    readonly _entertainerOrders = store<boolean>(true);

    //guest;
    readonly _tshirtColour = store<Colour>(defaultColour);
    readonly _trousersColour = store<Colour>(defaultColour);
    readonly _balloonColour = store<Colour>(defaultColour);
    readonly _hatColour = store<Colour>(defaultColour);
    readonly _umbrellaColour = store<Colour>(defaultColour);
    readonly _happiness = store<number>(0);
    readonly _nausea = store<number>(0);
    readonly _hunger = store<number>(255);
    readonly _thirst = store<number>(255);
    readonly _toilet = store<number>(0);
    readonly _mass = store<number>(0);
    readonly _items = store<GuestItem[]>([]);
    readonly _item = store<GuestItemType | null>(null);
    readonly _voucher = store<Voucher | null>(null);
    readonly _voucherItem = store<GuestItemType | null>(null);
    readonly _voucherType = store<VoucherType | null>(null);
    readonly _availableGuestAnimations = store<GuestAnimation[]>([]);

    //window
    readonly _selectPeepType = store<EntityType>("guest");
    //readonly _allGuestsSelected = compute(this._allGuests, g => g.length > 1);
    readonly _allGuestsSelected = store<boolean>(false);

    //custom
    readonly _isGuest = store<boolean>(false);
    readonly _isStaff = store<boolean>(false);
    readonly _isEntertainer = store<boolean>(false);
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = store<boolean>(false);
    readonly _isStatic = store<boolean>(false);
    readonly _isTracking = store<boolean>(false);
    readonly _isSelectingByTiles = store<boolean>(false);
    readonly _isPeepSelected = compute(this._selectedPeep, p => p);
    readonly _isSwitchingPeep = store<boolean>(false);


    readonly _isPositionDisabled = compute(this._isFrozen, this._isStatic, (f, s) => !f && !s);
    readonly _visibleRideDropdown = compute(this._item, this._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none")
    readonly _disabledWhenNoSinglePeepSelected = compute(this._isPeepSelected, this._allGuests, (p, a) => !p || a.length > 1);
    readonly _disabledWhenNoPeepSelected = compute(this._isPeepSelected, this._allGuests, (p, a) => !p && a.length <= 1);
    readonly _visibilityListviewWhenGuest = compute(this._selectPeepType, p => p === "guest" ? "visible" : "none");
    readonly _visibilityListviewWhenStaff = compute(this._selectPeepType, p => p === "staff" ? "visible" : "none");


    private _onGameTick?: IDisposable;
    private _guestGeneration?: IDisposable;
    private _isRefreshing?: boolean;



    constructor() {
        this._selectedPeep.subscribe(p => {
            if (p) {
                this._allGuests.set([p] as Guest[] | BaseStaff[])
                this.updatePeepInfo(p);
            }
        });
    }

    _open(): void {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted());
        this._conversionCheck();
    }

    _close(): void {
        this._allGuests.set([]);
        this._allGuestsSelected.set(false);
        this._selectedPeep.set(null);
        multiplierIndex.set(0);
    }

    _dispose(): void {
        if (this._onGameTick) {
        this._onGameTick.dispose();
        }
        if (this._guestGeneration) {
            this._guestGeneration.dispose();
        }
        this._onGameTick = undefined;
        this._guestGeneration = undefined;
    }

    _select(peep: Guest | BaseStaff): void {
        this._isSwitchingPeep.set(true);
        this._selectedPeep.set(peep);
        this._isSwitchingPeep.set(false);
    }

    _getAllGuests(): void {
        const guests = map.getAllEntities("guest");
        this._allGuests.set(guests);

        const firstGuest = guests[0];
        if (firstGuest) {
            this._availableAnimations.set(firstGuest.availableAnimations);
            this._animationLength.set(firstGuest.animationLength);
        }
    }

    _toggleAllGuests(isPressed: boolean): void {
        if (isPressed) {
            this._isPicking.set(false);
            this._isGuest.set(true);
            this._isStaff.set(false);
            this._getAllGuests();
            this._name.set(`{GREEN}All guests selected`);
            ui.tool?.cancel();
        }
        else if (!isPressed) {
            this._allGuests.set([]);
            this._selectedPeep.set(null);
            this._staffType.set(null);
            this._isGuest.set(false);
            this._name.set(windowTitle);
        }
        const colours = [
            this._tshirtColour,
            this._trousersColour,
            this._hatColour,
            this._balloonColour,
            this._umbrellaColour,
        ];
        colours.forEach(colour => colour.set(defaultColour));
    }

    _setMotion(motion: PeepMotion): void {
        const isStatic = motion !== "moving";
        const isFrozen = motion === "frozen";

        this._isStatic.set(isStatic);
        this._isFrozen.set(isFrozen);

        this._execute("pe-guestflags", id => guestFlagsExecuteArgs(id, isStatic, "positionFrozen"));
        this._execute("pe-guestflags", id => guestFlagsExecuteArgs(id, isFrozen, "animationFrozen"));
    }

    _SetPosition(axis: keyof CoordsXYZ, adjustment: number): void {
        this._execute("pe-position", id => positionExecuteArgs(id, axis, (adjustment * multiplier.get())));
    }

    _setDirection(direction: PeepDirection): void {
        this._execute("pe-direction", id => directionExecuteArgs(id, peepDirections.indexOf(direction) as Direction));
    }

    _setColour(colour: number, key?: GuestColours): void {
        this._execute("pe-colour", id => colourExecuteArgs(id, colour, key));
    }

    _setGuestKey(adjustment: number, key: GuestKey): void {
        this._execute("pe-guestkeys", id => guestKeysExecuteArgs(id, key, (adjustment * multiplier.get())));
    }

    _setStaffType(index: number): void {
        this._execute("pe-stafftype", id => staffTypeExecuteArgs(id, staffType[index]));
    }

    _setCostume(index: number): void {
        this._execute("pe-costume", id => costumeExecuteArgs(id, this._availableCostumes.get()[index]));
    }

    _setAnimation(index: number): void {
        this._execute("pe-animation", id => animationExecuteArgs(id, index));
    }

    _setFrame(value: number, adjustment: number): void {
        this._execute("pe-animationframe", id => animationFrameExecuteArgs(id, value, adjustment));
    }

    _setStaffOrders(check: boolean, order: number): void {
        this._execute("pe-stafforders", id => ordersExecuteArgs(id, check, order));
    }

    _removeItem(item: GuestItemType): void {
        this._execute("pe-removeitem", id => itemRemoveExecuteArgs(id, item));
    }

    _giveItem(item: GuestItemType | null): void {
        const currentRideId = rideId.get();
        const currentRide = map.getRide(currentRideId)
        const itemType = this._item.get();

        if (!currentRide && item !== null && (item.startsWith("photo") || model._voucherType.get() === "ride_free")) {
            ui.showError("There are no rides", "in your park!");
            return;
        }

        let payload: any;

        if (itemType === "voucher") {
            payload = this._voucher.get();
        }
        else if (itemType !== null && itemType.startsWith("photo")) {
            payload = <GuestPhoto>{ type: itemType, rideId: currentRideId };

            const rideName = currentRide.name;
            if (itemType === "photo1") photo1RideName.set(rideName);
            if (itemType === "photo2") photo2RideName.set(rideName);
            if (itemType === "photo3") photo3RideName.set(rideName);
            if (itemType === "photo4") photo4RideName.set(rideName);
        }
        else {
            payload = { type: item };
        }
        this._execute("pe-giveitem", id => giveItemExecuteArgs(id, payload));
    }

    private _execute(actionName: string, getArgs: (guestId: number | null) => any): void {
        if (this._allGuestsSelected.get()) {
            this._getAllGuests();
        }

        this._allGuests.get().forEach(guest => {
            if (guest)
                context.executeAction(actionName, getArgs(guest.id));
        });
    }

    _checkStaffOrders(order: number): WritableStore<boolean> {
        return compute(this._orders, o => (o & order) !== 0)
    }

    _isVisibleWhen(check: Store<boolean>): Bindable<ElementVisibility> {
        return compute(check, c => c ? "visible" : "none");
    }

    private _conversionCheck(): void {
        const staffToConvert = map.getAllEntities("staff").filter(staff => staff.energy === 0);
        for (const staff of staffToConvert) {
            const id = staff.id;
            context.executeAction("pe-guestkeys", guestKeysExecuteArgs(id, "energy", 96));
            ["positionFrozen", "animationFrozen"].forEach(flag => {
                context.executeAction("pe-guestflags", guestFlagsExecuteArgs(id, true, flag as any));
            });
            debug("Old freezing method converted to new method");
        }
    }

    private _computePeepProperty<P, T>(extractor: (peep: P) => T, fallback: T, expectedType?: string): WritableStore<T> {
        return compute(this._selectedPeep, p => {
            const isValid = p && (!expectedType || (p as any).peepType === expectedType);
            return isValid ? extractor(p as unknown as P) : fallback;
        });
    }

    private updatePeepInfo(peep: Guest | BaseStaff): void {
        this._isRefreshing = true;

        const guest = peep as Guest;
        const staff = peep as BaseStaff

        const isGuest = peep.type === "guest";
        const isStaff = peep.type === "staff";
        const _isEntertainer = staff.staffType === "entertainer";

        this._name.set(peep.name);
        this._animation.set(peep.animation);
        this._animationLength.set(peep.animationLength);
        this._animationFrame.set(peep.animationOffset);
        this._availableAnimations.set(peep.availableAnimations);
        this._isFrozen.set(peep.getFlag("animationFrozen"));
        this._isStatic.set(peep.getFlag("positionFrozen"));

        this._isGuest.set(isGuest);
        if (isGuest) {
            this._tshirtColour.set(guest.tshirtColour);
            this._trousersColour.set(guest.trousersColour);
            this._hatColour.set(guest.hatColour);
            this._balloonColour.set(guest.balloonColour);
            this._umbrellaColour.set(guest.umbrellaColour);
            this._items.set(guest.items);
        }

        this._isStaff.set(isStaff);
        if (isStaff) {
            this._isEntertainer.set(_isEntertainer);
            this._staffType.set(staff.staffType);
            this._availableCostumes.set(staff.availableCostumes);
            this._availableCostumeStrings.set(staff.getCostumeStrings());
            this._costumeIndex.set(staff.availableCostumes.indexOf(staff.costume as StaffCostume));
            this._orders.set(staff.orders);
            this._colour.set(staff.colour);
        }
        this._isRefreshing = false;
    }

    private _updateDynamicDataFromPeep(peep: Guest | BaseStaff): void {
        if (peep.peepType !== "guest" && peep.peepType !== "staff") {
            this._close();
            getWindow("Properties")?.close();
            ui.showError("Peep no longer", "available");
            return;
        }

        this._x.set(peep.x);
        this._y.set(peep.y);
        this._z.set(peep.z);
        this._energy.set(peep.energy);

        if (peep.type === "guest") {
            const guest = peep as Guest;

            this._happiness.set(guest.happiness);
            this._hunger.set(guest.hunger);
            this._thirst.set(guest.thirst);
            this._nausea.set(guest.nausea);
            this._toilet.set(guest.toilet);
            this._mass.set(guest.mass);
            this._getPhotoRideName(guest);
            this._isTracking.set((guest.getFlag("tracking")));
            this._items.set(guest.items);
        }
    }

    private _onGameTickExecuted(): void {
        if (this._allGuestsSelected.get()) {
            this._numGuests.set(map.getAllEntities("guest").length);
        }
        const peep = this._selectedPeep.get();
        if (peep) {
            this._updateDynamicDataFromPeep(peep);
        }
    }

    private _getPhotoRideName(guest: Guest): void {
        for (const item of guest.items) {
            if (!item.type.startsWith("photo")) continue;

            const photo = <GuestPhoto>item;
            const rideName = map.getRide(photo.rideId)?.name;

            if (!rideName) continue;

            switch (item.type) {
                case "photo1": photo1RideName.set(rideName); break;
                case "photo2": photo2RideName.set(rideName); break;
                case "photo3": photo3RideName.set(rideName); break;
                case "photo4": photo4RideName.set(rideName); break;
            }
        }
    }
}

export const model = new PeepViewModel;