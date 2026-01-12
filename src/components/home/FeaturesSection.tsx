import {
  Truck,
  BadgeCheck,
  MessageCircle,
  Percent,
  Leaf,
} from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: BadgeCheck,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: Percent,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
  {
    icon: Leaf,
    title: '24*7 Free Support',
    // desc: 'Get shipping on order over ₹500 only.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="">
      <div className="self-padding">
        <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-4">

          {features.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center px-6"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                  <Icon size={22} />
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900">
                  {item.title}
                </h4>

                {/* Description */}
                {/* <p className="mt-1 text-xs text-gray-500">
                  {item.desc}
                </p> */}

                {/* ✅ Vertical Divider */}
                {index !== features.length - 1 && (
                  <span className="
                    absolute right-0 top-1/2
                    hidden md:block
                    h-20 w-px
                    -translate-y-1/2
                    bg-green-500/60
                  " />
                )}
              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}
