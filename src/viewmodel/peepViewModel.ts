import { Colour, compute, store } from "openrct2-flexui";

const windowTitle = "Peep Editor";

export class peepViewModel
{
    readonly _selectedPeep = store<Guest | Staff | undefined>(undefined);
    readonly _name = store<string>(windowTitle);
    readonly _destination = store<CoordsXYZ | null>(null);
    readonly _energy = store<number>(96);
    readonly _energyTarget = store<number>(96);
    readonly _flag = store<boolean>(false);
    readonly _x = store<number>(0);
    readonly _y = store<number>(0);
    readonly _z = store<number>(0);
    readonly _image = store<number>(6430 | (Colour.SalmonPink) << 19 | (Colour.SalmonPink << 24) | (0b111 << 29))

    readonly _tshirtColour = store<number>(0);
    readonly _trousersColour = store<number>(0);
    readonly _balloonColour = store<number>(0);
    readonly _hatColour = store<number>(0);
    readonly _umbrellaColour = store<number>(0);
    readonly _happiness = store<number>(0);
    readonly _happinessTarget = store<number>(0);
    readonly _nausea = store<number>(0);
    readonly _nauseaTarget = store<number>(0);
    readonly _hunger = store<number>(0);
    readonly _thirst = store<number>(0);
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
    readonly _hasItem = store<boolean>(false);

    readonly _staffType = store<StaffType | null>(null);
    readonly _colour = store<number>(-1);
    readonly _availableCostumes = store<StaffCostume[]>([]);
    readonly _availableAnimations = store<GuestAnimation[]|StaffAnimation[]>([]);
    readonly _costume = store<StaffCostume | null>(null);
    readonly _orders = store<number>(0);
    readonly _patrolArea = store<PatrolArea | null>(null);
    readonly _animationFrame = store<number>(0);

    readonly _isStaff = store<boolean>(false);
    readonly _isGuest = store<boolean>(false);
    readonly _isPicking = store<boolean>(false);
    readonly _isFrozen = compute(this._selectedPeep, p => (p?.energy === 0) ? true : false);
    readonly _isPeepSelected = compute(this._selectedPeep, p => (p) ? false : true);
    readonly _formatPosition = (pos: number): string => (this._isPeepSelected.get() ? "Not available" : pos.toString());

    private _onGameTick?: IDisposable;

    constructor() {
    }

    _open(): void
    {
        this._onGameTick = context.subscribe("interval.tick", () => this._onGameTickExecuted())
    }

    _close(): void
    {
        if (this._onGameTick)
        {
            this._onGameTick.dispose();
        }
        this._onGameTick = undefined;
        this._selectedPeep.set(undefined);
        this._isFrozen.set(false);
        this._name.set(windowTitle);
        this._availableAnimations.set([]);
        this._x.set(0);
        this._y.set(0);
        this._z.set(0);
        this._energy.set(96);
        this._isStaff.set(false);
        this._isGuest.set(false);
    }

    _select(peep: Guest | Staff): void
    {
        this._selectedPeep.set(peep)
    }

    _freeze(frozen: boolean): void {
        const peep = this._selectedPeep.get();
        if (peep !== undefined) {
            if (frozen) {
                peep.energy = 0;
                this._isFrozen.set(true);
            }
            else {
                peep.energy = 96;
                this._isFrozen.set(false);
            }
        }
    }

    _tabImage(peep: Guest | Staff): void {

        if (peep !== undefined && peep.type === "guest") {
            this._image.set(6430 | (this._tshirtColour.get() << 19) | (this._trousersColour.get() << 24) | (0b111 << 29));
        }
        else if (peep !== undefined && peep.type === "staff") {
            const staff = <Staff>peep;
            switch (staff.staffType) {
                case "handyman":
                    this._image.set(11286 | (this._colour.get() << 19) | (0b111 << 29));
                    break;
                case "mechanic":
                    this._image.set(11466 | (this._colour.get() << 19) | (0b111 << 29));
                    break
                case "security":
                    this._image.set(11906 | (this._colour.get() << 19) | (0b111 << 29));
                    break
                case "entertainer":
                    this._image.set(0);
                    break;
            }
        }
    }

    _onGameTickExecuted(): void {
        const peep = this._selectedPeep.get();
        const staff = <Staff>peep;
        if (peep !== undefined)
        {
            this._x.set(peep.x);
            this._y.set(peep.y);
            this._z.set(peep.z);
            this._energy.set(peep.energy);
            this._colour.set(staff.colour);
            peep.energy === 0 ? this._isFrozen.set(true) : this._isFrozen.set(false);
            if (peep.peepType === "staff"){this._isStaff.set(true); this._isGuest.set(false)};
            if (peep.peepType === "guest"){this._isGuest.set(true); this._isStaff.set(false)};
        }
    }
}

export const model = new peepViewModel;